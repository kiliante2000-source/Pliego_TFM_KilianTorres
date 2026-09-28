import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import puppeteer from 'puppeteer-core';
import { PDFDocument, PDFName, PDFArray, PDFString } from 'pdf-lib';
import { prisma } from '../utils/prisma.js';
import { env } from '../utils/env.js';
import { AppError } from '../utils/errors.js';
import type { DocumentModel, CanvasElement, Page } from '../types/document.js';
import { isDocumentModel } from '../types/document.js';
import { projectService } from './projectService.js';
import { assetService } from './assetService.js';

type LinkKind = 'external' | 'page' | 'none';

type ResolvedLink = { kind: LinkKind; value?: string };

type PdfHotspot = {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  link: ResolvedLink;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function gradientCss(
  g: { type: 'linear' | 'radial'; angle?: number; stops: { offset: number; color: string }[] } | undefined,
  fallback: string,
) {
  if (!g?.stops?.length) return fallback;
  const stops = g.stops
    .map((s) => `${s.color} ${Math.round(s.offset * 100)}%`)
    .join(', ');
  if (g.type === 'radial') return `radial-gradient(circle at 50% 40%, ${stops})`;
  return `linear-gradient(${g.angle ?? 135}deg, ${stops})`;
}

function effectsInline(el: CanvasElement) {
  const e = el.effects;
  if (!e) return '';
  const parts: string[] = [];
  if (e.blur) parts.push(`filter:blur(${e.blur}px);`);
  if (e.shadowBlur || e.shadowOffsetX || e.shadowOffsetY) {
    const opacity = e.shadowOpacity ?? 0.35;
    parts.push(
      `box-shadow:${e.shadowOffsetX ?? 0}px ${e.shadowOffsetY ?? 12}px ${e.shadowBlur ?? 32}px ${e.shadowColor ?? `rgba(0,0,0,${opacity})`};`,
    );
  }
  if (e.blendMode && e.blendMode !== 'normal') parts.push(`mix-blend-mode:${e.blendMode};`);
  return parts.join('');
}

/** Resolve PLIEGO interaction href to page id or external URL. */
export function resolveInteractionHref(
  href: string | undefined,
  pages: Page[],
  currentPageId: string,
  options?: { defaultNextForButton?: boolean; webBase?: string | null },
): ResolvedLink {
  const raw = (href ?? '').trim();
  const ordered = [...pages].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.id === currentPageId);

  if (!raw || raw === '#' || raw === 'pliego:next') {
    if (!raw && !options?.defaultNextForButton) return { kind: 'none' };
    const next = ordered[idx + 1];
    return next ? { kind: 'page', value: next.id } : { kind: 'none' };
  }
  if (raw === 'pliego:prev') {
    const prev = ordered[idx - 1];
    return prev ? { kind: 'page', value: prev.id } : { kind: 'none' };
  }
  if (raw.startsWith('pliego:page:')) {
    const id = raw.slice('pliego:page:'.length);
    const page = ordered.find((p) => p.id === id || p.name === id);
    return page ? { kind: 'page', value: page.id } : { kind: 'none' };
  }
  if (raw.startsWith('#page:')) {
    const key = raw.slice('#page:'.length);
    const page = ordered.find((p) => p.id === key || p.name === key);
    return page ? { kind: 'page', value: page.id } : { kind: 'none' };
  }
  if (/^https?:\/\//i.test(raw) || raw.startsWith('mailto:')) {
    return { kind: 'external', value: raw };
  }
  // Site-relative paths (/contacto, /) → absolute web URL for PDF readers outside the app
  if (raw.startsWith('/')) {
    const base = (options?.webBase || env.FRONTEND_URL || '').replace(/\/$/, '');
    if (!base) return { kind: 'none' };
    return { kind: 'external', value: `${base}${raw === '/' ? '' : raw}` || `${base}/` };
  }
  const page = ordered.find((p) => p.id === raw || p.name === raw);
  if (page) return { kind: 'page', value: page.id };
  return { kind: 'none' };
}

function linkHrefForHtml(
  link: ResolvedLink,
  ctx: { publicBase?: string | null },
): string | null {
  if (link.kind === 'external' && link.value) return link.value;
  if (link.kind === 'page' && link.value) {
    // Internal PDF destination (Chromium maps fragment ids when printing)
    // Plus optional public web fallback via title attribute only.
    return `#page-${link.value}`;
  }
  return null;
}

function wrapInteractive(
  inner: string,
  style: string,
  link: ResolvedLink,
  ctx: { publicBase?: string | null },
): string {
  const href = linkHrefForHtml(link, ctx);
  if (!href) {
    return `<div style="${style}">${inner}</div>`;
  }
  const target =
    link.kind === 'external' ? ' target="_blank" rel="noopener noreferrer"' : '';
  const title =
    link.kind === 'page' && ctx.publicBase
      ? ` title="También en web: ${escapeHtml(ctx.publicBase)}#page-${link.value}"`
      : '';
  // Anchor fills the box; content inside
  return `<a href="${escapeHtml(href)}"${target}${title} style="${style}display:block;text-decoration:none;color:inherit;cursor:pointer;">${inner}</a>`;
}

function elementHtml(
  el: CanvasElement,
  pages: Page[],
  currentPageId: string,
  ctx: { publicBase?: string | null },
): string {
  const base = `
    left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;
    transform:rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY});
    opacity:${el.opacity};position:absolute;transform-origin:center center;box-sizing:border-box;
    ${effectsInline(el)}
  `;

  const hasLinkIntent = Boolean(el.interaction?.href) || el.type === 'button';
  const link = hasLinkIntent
    ? resolveInteractionHref(el.interaction?.href, pages, currentPageId, {
        defaultNextForButton: el.type === 'button',
        webBase: ctx.publicBase ?? env.FRONTEND_URL,
      })
    : el.type === 'video' && el.src && /^https?:\/\//i.test(el.src)
      ? ({ kind: 'external', value: el.src } as ResolvedLink)
      : ({ kind: 'none' } as ResolvedLink);

  if (el.type === 'text') {
    const inner = escapeHtml(el.text);
    const style = `${base}font-size:${el.style.fontSize}px;font-family:${el.style.fontFamily},sans-serif;font-weight:${el.style.fontWeight};font-style:${el.style.italic ? 'italic' : 'normal'};text-decoration:${el.style.underline ? 'underline' : 'none'};color:${el.style.color};text-align:${el.style.align};line-height:${el.style.lineHeight ?? 1.3};letter-spacing:${el.style.letterSpacing ?? 0}px;text-transform:${el.style.textTransform ?? 'none'};white-space:pre-wrap;`;
    if (link.kind !== 'none') return wrapInteractive(inner, style, link, ctx);
    return `<div style="${style}">${inner}</div>`;
  }

  if (el.type === 'image') {
    const style = `${base}object-fit:${el.fit ?? 'cover'};border-radius:${el.cornerRadius ?? 0}px;`;
    const img = `<img src="${escapeHtml(el.src)}" alt="" style="width:100%;height:100%;object-fit:${el.fit ?? 'cover'};border-radius:${el.cornerRadius ?? 0}px;display:block;" />`;
    if (link.kind !== 'none') {
      return wrapInteractive(img, `${base}padding:0;overflow:hidden;border-radius:${el.cornerRadius ?? 0}px;`, link, ctx);
    }
    return `<img src="${escapeHtml(el.src)}" alt="" style="${style}" />`;
  }

  if (el.type === 'button') {
    const style = `${base}display:grid;place-items:center;background:${el.fill};color:${el.textColor};border-radius:${el.cornerRadius ?? 999}px;font-family:${el.fontFamily ?? 'Space Grotesk'},sans-serif;font-size:${el.fontSize ?? 16}px;font-weight:${el.fontWeight ?? 600};`;
    return wrapInteractive(escapeHtml(el.label), style, link, ctx);
  }

  if (el.type === 'video') {
    const style = `${base}display:grid;place-items:center;background:#111;border-radius:${el.cornerRadius ?? 12}px;color:#fff;font-family:JetBrains Mono,monospace;font-size:14px;text-align:center;padding:8px;`;
    const label = el.src ? `▶ VÍDEO<br/><span style="font-size:11px;opacity:.75">Abrir enlace</span>` : '▶ VÍDEO';
    if (link.kind !== 'none') return wrapInteractive(label, style, link, ctx);
    return `<div style="${style}">▶ VÍDEO</div>`;
  }

  if (el.type === 'shape') {
    const bg = gradientCss(el.fillGradient, el.fill);
    const radius = el.shape === 'ellipse' ? '50%' : `${el.cornerRadius ?? 0}px`;
    const style = `${base}background:${bg};border-radius:${radius};border:${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'};`;
    if (link.kind !== 'none') return wrapInteractive('', style, link, ctx);
    return `<div style="${style}"></div>`;
  }

  return '';
}

function collectHotspots(
  doc: DocumentModel,
  options?: { webBase?: string | null },
): PdfHotspot[] {
  const pages = [...doc.pages].sort((a, b) => a.order - b.order);
  const hotspots: PdfHotspot[] = [];

  pages.forEach((page, pageIndex) => {
    for (const el of page.elements) {
      const hasLinkIntent = Boolean(el.interaction?.href) || el.type === 'button';
      const link = hasLinkIntent
        ? resolveInteractionHref(el.interaction?.href, pages, page.id, {
            defaultNextForButton: el.type === 'button',
            webBase: options?.webBase ?? env.FRONTEND_URL,
          })
        : el.type === 'video' && el.src && /^https?:\/\//i.test(el.src)
          ? ({ kind: 'external', value: el.src } as ResolvedLink)
          : ({ kind: 'none' } as ResolvedLink);

      if (link.kind === 'none') continue;

      // Axis-aligned box (rotation approximated). PDF origin is bottom-left.
      hotspots.push({
        pageIndex,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        link,
      });
    }
  });

  return hotspots;
}

function renderDocumentHtml(
  doc: DocumentModel,
  ctx: { publicBase?: string | null; title?: string },
): string {
  const pages = [...doc.pages].sort((a, b) => a.order - b.order);
  const pageBlocks = pages
    .map((page) => {
      const els = [...page.elements]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((el) => elementHtml(el, pages, page.id, ctx))
        .join('\n');
      return `
        <section id="page-${page.id}" class="page" style="width:${doc.meta.width}px;height:${doc.meta.height}px;background:${page.background.fill};position:relative;overflow:hidden;page-break-after:always;">
          ${els}
        </section>
      `;
    })
    .join('\n');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(ctx.title ?? doc.meta.title ?? 'PLIEGO')}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@500;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; }
    .page { margin: 0 auto; }
    a { color: inherit; }
    @page { size: ${doc.meta.width}px ${doc.meta.height}px; margin: 0; }
  </style>
</head>
<body>${pageBlocks}</body>
</html>`;
}

/**
 * Add explicit PDF link annotations so interactivity works in Acrobat, Preview, browsers, etc.
 * Chromium already embeds many links from <a href>; this reinforces GoTo + URI actions.
 */
async function annotatePdfLinks(
  pdfBytes: Uint8Array,
  doc: DocumentModel,
  options?: { webBase?: string | null },
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();
  const ordered = [...doc.pages].sort((a, b) => a.order - b.order);
  const pageIdToIndex = new Map(ordered.map((p, i) => [p.id, i]));
  const hotspots = collectHotspots(doc, options);
  const pageHeight = doc.meta.height;

  for (const spot of hotspots) {
    const pdfPage = pages[spot.pageIndex];
    if (!pdfPage) continue;

    const x = spot.x;
    const y = pageHeight - spot.y - spot.height;
    const w = Math.max(4, spot.width);
    const h = Math.max(4, spot.height);

    let actionRef;
    if (spot.link.kind === 'external' && spot.link.value) {
      actionRef = pdf.context.register(
        pdf.context.obj({
          Type: 'Action',
          S: 'URI',
          URI: PDFString.of(spot.link.value),
        }),
      );
    } else if (spot.link.kind === 'page' && spot.link.value) {
      const targetIndex = pageIdToIndex.get(spot.link.value);
      const targetPage = targetIndex != null ? pages[targetIndex] : undefined;
      if (!targetPage) continue;
      actionRef = pdf.context.register(
        pdf.context.obj({
          Type: 'Action',
          S: 'GoTo',
          D: [targetPage.ref, 'XYZ', 0, pageHeight, null],
        }),
      );
    } else {
      continue;
    }

    const annotRef = pdf.context.register(
      pdf.context.obj({
        Type: 'Annot',
        Subtype: 'Link',
        Rect: [x, y, x + w, y + h],
        Border: [0, 0, 0],
        C: [0.31, 0.5, 1],
        F: 4,
        A: actionRef,
      }),
    );

    const annots = pdfPage.node.lookupMaybe(PDFName.of('Annots'), PDFArray);
    if (annots) {
      annots.push(annotRef);
    } else {
      pdfPage.node.set(PDFName.of('Annots'), pdf.context.obj([annotRef]));
    }
  }

  return pdf.save({ useObjectStreams: false });
}

export class ExportService {
  async exportPdf(projectId: string, ownerId: string) {
    const project = await projectService.getOwned(projectId, ownerId);
    const document = JSON.parse(project.documentJson);
    if (!isDocumentModel(document)) {
      throw new AppError(400, 'Documento inválido para exportar', 'INVALID_DOCUMENT');
    }

    await assetService.ensureDirs();

    const exportRow = await prisma.export.create({
      data: {
        projectId,
        status: 'processing',
      },
    });

    const publicBase =
      project.published && project.slug
        ? `${env.FRONTEND_URL.replace(/\/$/, '')}/p/${project.slug}`
        : null;

    try {
      const html = renderDocumentHtml(document, {
        publicBase,
        title: project.title || document.meta.title,
      });
      const browser = await puppeteer.launch({
        executablePath: env.CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      let pdfBytes: Uint8Array;
      try {
        const page = await browser.newPage();
        await page.setViewport({
          width: document.meta.width,
          height: document.meta.height,
          deviceScaleFactor: 1,
        });
        await page.setContent(html, { waitUntil: 'load', timeout: 60_000 });

        const raw = await page.pdf({
          width: `${document.meta.width}px`,
          height: `${document.meta.height}px`,
          printBackground: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });
        pdfBytes = raw;
      } finally {
        await browser.close();
      }

      // Reinforce clickable CTAs / links for all PDF readers
      const interactivePdf = await annotatePdfLinks(pdfBytes, document, {
        webBase: publicBase ?? env.FRONTEND_URL,
      });

      const fileKey = `${projectId}/${randomUUID()}.pdf`;
      const fullPath = path.join(env.EXPORT_DIR, fileKey);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, interactivePdf);

      const updated = await prisma.export.update({
        where: { id: exportRow.id },
        data: { status: 'ready', fileKey },
      });

      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de exportación';
      await prisma.export.update({
        where: { id: exportRow.id },
        data: { status: 'failed', error: message },
      });
      throw new AppError(500, `No se pudo generar el PDF: ${message}`, 'EXPORT_FAILED');
    }
  }

  async getOwnedExport(exportId: string, ownerId: string) {
    const row = await prisma.export.findUnique({
      where: { id: exportId },
      include: { project: true },
    });
    if (!row || row.project.ownerId !== ownerId) {
      throw new AppError(404, 'Exportación no encontrada', 'EXPORT_NOT_FOUND');
    }
    return row;
  }

  resolvePath(fileKey: string) {
    const resolved = path.resolve(env.EXPORT_DIR, fileKey);
    const root = path.resolve(env.EXPORT_DIR);
    if (!resolved.startsWith(root)) {
      throw new AppError(400, 'Ruta inválida', 'INVALID_PATH');
    }
    return resolved;
  }
}

export const exportService = new ExportService();
