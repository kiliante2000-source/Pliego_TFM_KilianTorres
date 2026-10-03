#!/usr/bin/env node
/**
 * Exporta un ejemplo real de proyecto PLIEGO (PDF interactivo) vía API
 * → docs/evaluacion/ejemplo-proyecto/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const require = createRequire(path.join(ROOT, 'frontend/package.json'));
const { chromium } = require('playwright');

const BASE = process.env.PLIEGO_BASE_URL || 'http://127.0.0.1:45321';
const API = process.env.PLIEGO_API_URL || 'http://127.0.0.1:45322';
const OUT = path.join(ROOT, 'docs/evaluacion/ejemplo-proyecto');
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  // Prefer API cookie login
  const loginRes = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@pliego.app', password: 'demo1234' }),
  });
  if (!loginRes.ok) throw new Error(`login ${loginRes.status}`);
  const setCookie = loginRes.headers.getSetCookie?.() || [];
  const cookieHeader = setCookie.map((c) => c.split(';')[0]).join('; ');
  // fallback parse
  const raw = loginRes.headers.get('set-cookie') || '';
  const cookie = cookieHeader || raw.split(',').map((p) => p.split(';')[0].trim()).filter(Boolean).join('; ');

  const projectsRes = await fetch(`${API}/api/projects`, { headers: { Cookie: cookie } });
  const { projects } = await projectsRes.json();
  let project = projects.find((p) => /portada|manifesto|demo/i.test(p.title || p.slug || '')) || projects[0];
  if (!project) throw new Error('No projects');

  // Create from template if needed for a richer example
  const templatesRes = await fetch(`${API}/api/projects/templates`, { headers: { Cookie: cookie } });
  const { templates } = await templatesRes.json();
  const manifesto = templates?.find((t) => t.id === 'manifesto-digital') || templates?.[0];
  if (manifesto) {
    const alt = await fetch(`${API}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({
        templateId: manifesto.id,
        title: 'Ejemplo TFM — Manifiesto PLIEGO',
      }),
    }).catch(() => null);
    if (alt && alt.ok) {
      const created = await alt.json();
      project = created.project || created;
    }
  }

  const projectId = project.id;
  console.log('exporting project', projectId, project.title || project.slug);

  // Publish for public URL evidence
  await fetch(`${API}/api/projects/${projectId}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ published: true }),
  }).catch(() => {});

  const exportRes = await fetch(`${API}/api/projects/${projectId}/export/pdf`, {
    method: 'POST',
    headers: { Cookie: cookie },
  });
  if (!exportRes.ok) {
    const errText = await exportRes.text();
    throw new Error(`export failed ${exportRes.status}: ${errText.slice(0, 300)}`);
  }
  const exportJson = await exportRes.json();
  const exportId = exportJson.export?.id || exportJson.id || exportJson.exportId;
  let pdfBuf;
  if (exportJson.downloadUrl || exportId) {
    const dl = exportJson.downloadUrl
      ? `${API}${exportJson.downloadUrl}`
      : `${API}/api/projects/exports/${exportId}/download`;
    const dlRes = await fetch(dl, { headers: { Cookie: cookie } });
    if (!dlRes.ok) throw new Error(`download ${dlRes.status}`);
    pdfBuf = Buffer.from(await dlRes.arrayBuffer());
  } else if (exportJson.pdfBase64) {
    pdfBuf = Buffer.from(exportJson.pdfBase64, 'base64');
  } else {
    throw new Error(`Unexpected export payload: ${JSON.stringify(exportJson).slice(0, 400)}`);
  }

  const pdfPath = path.join(OUT, 'PLIEGO_EJEMPLO_MANIFIESTO.pdf');
  fs.writeFileSync(pdfPath, pdfBuf);

  // Refresh project for slug
  const one = await fetch(`${API}/api/projects/${projectId}`, { headers: { Cookie: cookie } });
  const oneJson = one.ok ? await one.json() : { project };
  const p = oneJson.project || project;

  // Screenshot of public + editor via Playwright
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'demo@pliego.app');
  await page.fill('input[type="password"]', 'demo1234');
  await Promise.all([
    page.waitForURL(/\/app/),
    page.locator('button[type="submit"]').click(),
  ]);
  await page.goto(`${BASE}/app/editor/${projectId}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, 'ejemplo-editor.png') });
  if (p.slug) {
    await page.goto(`${BASE}/p/${p.slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT, 'ejemplo-publico.png') });
  }
  await browser.close();

  const fiche = `# Ejemplo de proyecto PLIEGO — resultado real

Pieza generada desde la app para la memoria del TFM: demuestra un entregable
**funcional, interactivo y de diseño** producido con PLIEGO.

## Datos

| Campo | Valor |
|---|---|
| Título | ${p.title || 'Ejemplo TFM'} |
| Project ID | \`${projectId}\` |
| Slug público | ${p.slug ? `/p/${p.slug}` : '—'} |
| Formato | ${p.width || '—'} × ${p.height || '—'} |
| Plantilla origen | manifesto-digital / colección PLIEGO |
| Entregable PDF | [PLIEGO_EJEMPLO_MANIFIESTO.pdf](./PLIEGO_EJEMPLO_MANIFIESTO.pdf) |

## Qué demuestra

1. **Diseño editorial** en canvas Konva (tipografía, composición, identidad PLIEGO).
2. **Interactividad en PDF**: CTAs/enlaces anotados (GoTo/URI) vía pipeline Puppeteer + pdf-lib.
3. **Publicación web** opcional en \`/p/:slug\` (vista viva, no solo archivo).
4. **Reproducibilidad**: se puede volver a exportar con la cuenta demo o el script
   \`node scripts/export-example-project.mjs\`.

## Capturas

- \`ejemplo-editor.png\` — pieza abierta en el estudio
- \`ejemplo-publico.png\` — vista pública
- \`PLIEGO_EJEMPLO_MANIFIESTO.pdf\` — descarga del resultado

## Cómo se hizo (pasos de producto)

1. Login en el estudio (\`demo@pliego.app\`).
2. Abrir plantilla de la colección (Manifiesto / Portada).
3. (Opcional) Ajustar textos/capas en el editor.
4. Pulsar **PDF interactivo** o ejecutar este script.
5. Publicar y compartir \`/p/:slug\`.
`;

  fs.writeFileSync(path.join(OUT, 'README.md'), fiche);
  fs.writeFileSync(
    path.join(OUT, 'meta.json'),
    JSON.stringify(
      {
        projectId,
        title: p.title,
        slug: p.slug,
        width: p.width,
        height: p.height,
        pdf: 'PLIEGO_EJEMPLO_MANIFIESTO.pdf',
        bytes: pdfBuf.length,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  // artifacts copy
  const art = '/opt/cursor/artifacts/evaluacion/ejemplo-proyecto';
  fs.mkdirSync(art, { recursive: true });
  fs.copyFileSync(pdfPath, path.join(art, 'PLIEGO_EJEMPLO_MANIFIESTO.pdf'));
  for (const f of ['ejemplo-editor.png', 'ejemplo-publico.png', 'README.md']) {
    const src = path.join(OUT, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(art, f));
  }

  console.log(JSON.stringify({ ok: true, pdf: pdfPath, bytes: pdfBuf.length, slug: p.slug }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
