import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import puppeteer from 'puppeteer-core';
import { prisma } from '../utils/prisma.js';
import { env } from '../utils/env.js';
import { AppError } from '../utils/errors.js';
import type { DocumentModel, CanvasElement } from '../types/document.js';
import { isDocumentModel } from '../types/document.js';
import { projectService } from './projectService.js';
import { assetService } from './assetService.js';

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
    parts.push(
      `box-shadow:${e.shadowOffsetX ?? 0}px ${e.shadowOffsetY ?? 12}px ${e.shadowBlur ?? 32}px ${e.shadowColor ?? 'rgba(0,0,0,0.35)'};`,
    );
  }
  if (e.blendMode && e.blendMode !== 'normal') parts.push(`mix-blend-mode:${e.blendMode};`);
  return parts.join('');
}

function elementHtml(el: CanvasElement): string {
  const base = `
    left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;
    transform:rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY});
    opacity:${el.opacity};position:absolute;transform-origin:center center;
    ${effectsInline(el)}
  `;

  if (el.type === 'text') {
    return `<div style="${base}font-size:${el.style.fontSize}px;font-family:${el.style.fontFamily},sans-serif;font-weight:${el.style.fontWeight};font-style:${el.style.italic ? 'italic' : 'normal'};text-decoration:${el.style.underline ? 'underline' : 'none'};color:${el.style.color};text-align:${el.style.align};line-height:${el.style.lineHeight ?? 1.3};letter-spacing:${el.style.letterSpacing ?? 0}px;text-transform:${el.style.textTransform ?? 'none'};white-space:pre-wrap;">${escapeHtml(el.text)}</div>`;
  }

  if (el.type === 'image') {
    return `<img src="${escapeHtml(el.src)}" alt="" style="${base}object-fit:${el.fit ?? 'cover'};border-radius:${el.cornerRadius ?? 0}px;" />`;
  }

  if (el.type === 'button') {
    return `<div style="${base}display:grid;place-items:center;background:${el.fill};color:${el.textColor};border-radius:${el.cornerRadius ?? 999}px;font-family:${el.fontFamily ?? 'Space Grotesk'},sans-serif;font-size:${el.fontSize ?? 16}px;font-weight:${el.fontWeight ?? 600};">${escapeHtml(el.label)}</div>`;
  }

  if (el.type === 'video') {
    return `<div style="${base}display:grid;place-items:center;background:#111;border-radius:${el.cornerRadius ?? 12}px;color:#fff;font-family:JetBrains Mono,monospace;font-size:14px;">VIDEO</div>`;
  }

  if (el.type === 'shape') {
    const bg = gradientCss(el.fillGradient, el.fill);
    if (el.shape === 'ellipse') {
      return `<div style="${base}background:${bg};border-radius:50%;border:${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'};"></div>`;
    }
    return `<div style="${base}background:${bg};border-radius:${el.cornerRadius ?? 0}px;border:${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'};"></div>`;
  }

  return '';
}

function renderDocumentHtml(doc: DocumentModel): string {
  const pages = [...doc.pages].sort((a, b) => a.order - b.order);
  const pageBlocks = pages
    .map((page) => {
      const els = [...page.elements]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(elementHtml)
        .join('\n');
      return `
        <section class="page" style="width:${doc.meta.width}px;height:${doc.meta.height}px;background:${page.background.fill};position:relative;overflow:hidden;page-break-after:always;">
          ${els}
        </section>
      `;
    })
    .join('\n');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@500;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; }
    .page { margin: 0 auto; }
    @page { size: ${doc.meta.width}px ${doc.meta.height}px; margin: 0; }
  </style>
</head>
<body>${pageBlocks}</body>
</html>`;
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

    try {
      const html = renderDocumentHtml(document);
      const browser = await puppeteer.launch({
        executablePath: env.CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      try {
        const page = await browser.newPage();
        await page.setViewport({
          width: document.meta.width,
          height: document.meta.height,
          deviceScaleFactor: 1,
        });
        await page.setContent(html, { waitUntil: 'load' });

        const fileKey = `${projectId}/${randomUUID()}.pdf`;
        const fullPath = path.join(env.EXPORT_DIR, fileKey);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });

        await page.pdf({
          path: fullPath,
          width: `${document.meta.width}px`,
          height: `${document.meta.height}px`,
          printBackground: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });

        const updated = await prisma.export.update({
          where: { id: exportRow.id },
          data: { status: 'ready', fileKey },
        });

        return updated;
      } finally {
        await browser.close();
      }
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
