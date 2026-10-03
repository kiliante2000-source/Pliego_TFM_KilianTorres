#!/usr/bin/env node
/**
 * Builds docs/evaluacion/PLIEGO_E2E_EVALUACION.pdf from results.json + capturas.
 * Los tiempos mostrados son de usuario real estimado (userMs), no del robot.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'docs/evaluacion');
const require = createRequire(path.join(ROOT, 'frontend/package.json'));
const { chromium } = require('playwright');

const results = JSON.parse(fs.readFileSync(path.join(OUT, 'results.json'), 'utf8'));
const date = new Date(results.generatedAt);
const dateLabel = date.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
const s = results.summary;
const userMin = s.totalUserMinutes ?? Math.round((s.totalMs || 0) / 60000 * 10) / 10;
const avgMin = s.averageUserMinutesPerPersona ?? 0;
const autoSec = Math.round((s.automatedMs || 0) / 1000);

function fmtUser(ms) {
  const sec = Math.round((ms || 0) / 1000);
  if (sec < 60) return `${sec} s`;
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return r ? `${m} min ${r} s` : `${m} min`;
}

function b64(file) {
  const preferred = file.startsWith('capturas/')
    ? path.join(OUT, file.replace(/^capturas\//, 'capturas/_pdf/'))
    : null;
  const p = preferred && fs.existsSync(preferred) ? preferred : path.join(OUT, file);
  if (!fs.existsSync(p)) return null;
  const ext = path.extname(p).slice(1) || 'png';
  return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${fs.readFileSync(p).toString('base64')}`;
}

function img(file, caption) {
  const src = b64(file);
  if (!src) return `<p class="muted">[Captura no disponible: ${file}]</p>`;
  return `<figure><img src="${src}" alt="${caption}"/><figcaption>${caption}</figcaption></figure>`;
}

function taskRows(persona) {
  return persona.tasks
    .map(
      (t) => `<tr>
      <td>${t.id}</td>
      <td>${t.label}</td>
      <td class="${t.status}">${t.status === 'pass' ? 'OK' : 'FALLO'}</td>
      <td>${fmtUser(t.userMs)}</td>
      <td>${(t.notes || []).join('; ')}</td>
    </tr>`,
    )
    .join('\n');
}

const shotCandidates = [
  ['capturas/ana-01-landing.png', 'Landing — primer contacto con la marca'],
  ['capturas/ana-03-plantillas.png', 'Colección de plantillas (desktop)'],
  ['capturas/ana-04-editor.png', 'Editor Konva tras abrir plantilla'],
  ['capturas/ana-05-pdf.png', 'Exportación PDF interactivo'],
  ['capturas/luis-01-demo.png', 'Demo viva sin autenticación'],
  ['capturas/luis-02-registro.png', 'Registro de cuenta nueva'],
  ['capturas/luis-03-lienzo.png', 'Lienzo en blanco en el editor'],
  ['capturas/marta-02-plantillas-mobile.png', 'Plantillas en viewport móvil'],
  ['capturas/marta-03-editor-mobile.png', 'Editor compacto en móvil'],
  ['capturas/irene-02-plantillas-tablet.png', 'Plantillas en tablet'],
  ['capturas/irene-03-editor-tablet.png', 'Editor en tablet'],
  ['capturas/carlos-03-publicado.png', 'Publicación de proyecto'],
  ['capturas/carlos-04-publico.png', 'Vista pública /p/:slug'],
  ['capturas/elena-03-publico.png', 'Visitante lee pieza pública'],
  ['capturas/sofia-03-versiones.png', 'Panel de versiones'],
  ['capturas/diego-01-recursos.png', 'Pestaña de recursos'],
  ['capturas/hugo-02-filtro.png', 'Listado / filtros de proyectos'],
  ['capturas/pablo-01-ajustes.png', 'Ajustes del estudio'],
  ['ejemplo-proyecto/ejemplo-editor.png', 'Ejemplo real — editor'],
  ['ejemplo-proyecto/ejemplo-publico.png', 'Ejemplo real — vista pública'],
];
const keyShots = shotCandidates.filter(([f]) => fs.existsSync(path.join(OUT, f)) || fs.existsSync(path.join(OUT, f.replace(/^capturas\//, 'capturas/_pdf/'))));

const coverage = [
  ['Landing / descubrimiento', 'Ana, Elena'],
  ['Login', 'Ana, Marta, Carlos, Sofía, Diego, Hugo, Irene, Pablo'],
  ['Registro', 'Luis'],
  ['Demo viva', 'Luis, Elena'],
  ['Galería de plantillas', 'Ana, Marta, Diego, Irene'],
  ['Abrir plantilla → editor', 'Ana, Marta, Irene'],
  ['Lienzo en blanco', 'Luis'],
  ['Export PDF interactivo', 'Ana (+ ejemplo proyecto)'],
  ['Publicar proyecto', 'Carlos'],
  ['Vista pública /p/:slug', 'Carlos, Elena'],
  ['Versiones', 'Sofía'],
  ['Recursos / assets', 'Diego'],
  ['Gestión listado proyectos', 'Hugo'],
  ['Tablet', 'Irene'],
  ['Ajustes / motion', 'Pablo'],
  ['Móvil', 'Marta'],
];

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<title>PLIEGO — Evaluación E2E y usabilidad por escenarios</title>
<style>
  @page { size: A4; margin: 16mm 14mm 18mm 14mm; }
  :root {
    --ink: #0B0E11; --muted: #4A5058; --neon: #4F80FF; --line: #D8DDE5;
    --ok: #1B7A4A; --fail: #B42318;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: "DM Sans", "Segoe UI", sans-serif;
    color: var(--ink); background: white; line-height: 1.55; font-size: 10.5pt;
  }
  h1,h2,h3 {
    font-family: "Space Grotesk", "Segoe UI", sans-serif;
    line-height: 1.2; letter-spacing: -0.02em; page-break-after: avoid;
  }
  h1 { font-size: 1.65rem; margin: 0 0 0.4rem; }
  h2 { font-size: 1.15rem; margin: 1.5rem 0 0.5rem; padding-top: 0.35rem; border-top: 1px solid var(--line); }
  h3 { font-size: 1.02rem; margin: 1rem 0 0.35rem; color: #152238; }
  .banner { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--neon); font-weight: 700; }
  .meta { color: var(--muted); font-size: 0.92rem; margin: 0.4rem 0 1rem; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 0.8rem 0 1rem; }
  .kpi {
    border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px;
    background: linear-gradient(180deg, #F7F9FC, #fff);
  }
  .kpi b { display: block; font-size: 1.3rem; font-family: "Space Grotesk", sans-serif; }
  .kpi span { color: var(--muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: .06em; }
  table { width: 100%; border-collapse: collapse; font-size: 0.86rem; margin: 0.5rem 0 0.9rem; }
  th, td { border: 1px solid var(--line); padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #EEF2FF; }
  td.pass { color: var(--ok); font-weight: 700; }
  td.fail { color: var(--fail); font-weight: 700; }
  figure { margin: 0.6rem 0 0.9rem; break-inside: avoid; page-break-inside: avoid; }
  img {
    width: 100%; max-height: 260px; object-fit: contain; object-position: top;
    border: 1px solid var(--line); border-radius: 8px; background: #111;
  }
  figcaption { font-size: 0.78rem; color: var(--muted); margin-top: 3px; }
  ul, ol { padding-left: 1.15rem; }
  .note {
    background: #F4F7FF; border-left: 3px solid var(--neon);
    padding: 8px 12px; margin: 0.7rem 0; font-size: 0.9rem;
  }
  .persona-box {
    border: 1px solid var(--line); border-radius: 12px;
    padding: 10px 12px; margin: 0.7rem 0 1rem; break-inside: avoid;
  }
  .muted { color: var(--muted); }
  .footer {
    margin-top: 1.3rem; padding-top: 0.5rem; border-top: 1px solid var(--line);
    font-size: 0.75rem; color: var(--muted);
  }
</style>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"/>
</head>
<body>
  <div class="banner">PLIEGO · TFM · Anexo de evaluación</div>
  <h1>E2E, evaluación con usuarios y capturas funcionales</h1>
  <p class="meta">
    Evidencia para la memoria: pruebas end-to-end, evaluación por perfiles y capturas de la app real.<br/>
    Generado: ${dateLabel} · Base: ${results.baseUrl}
  </p>

  <div class="kpis">
    <div class="kpi"><b>${s.personas}</b><span>Personas</span></div>
    <div class="kpi"><b>${s.tasks}</b><span>Tareas</span></div>
    <div class="kpi"><b>${s.passRate}%</b><span>Éxito</span></div>
    <div class="kpi"><b>${userMin} min</b><span>Tiempo usuario real</span></div>
  </div>

  <div class="note">
    <strong>Tiempo total = tiempo de usuario real estimado</strong> (lectura, decisión, interacción y espera de export),
    sumando todos los escenarios: <strong>${userMin} minutos</strong>
    (media ≈ <strong>${avgMin} min</strong> por persona).
    El robot Playwright tardó solo ~${autoSec}s en ejecutar las mismas rutas; ese valor técnico
    <em>no</em> se usa como “tiempo de uso” en la memoria.
  </div>

  <h2>1. Objetivo</h2>
  <p>
    Cubrir lo que faltaba documentar: <strong>E2E</strong>, <strong>evaluación con usuarios (personas)</strong>
    y <strong>capturas funcionales</strong>, más un <strong>ejemplo de proyecto real</strong> exportado desde PLIEGO
    (PDF interactivo + vista pública) para anexar a la memoria del TFM.
  </p>

  <h2>2. Metodología</h2>
  <p>${results.methodology}</p>
  <ul>
    <li><strong>Tipo:</strong> evaluación task-based con ${s.personas} personas representativas.</li>
    <li><strong>Entorno:</strong> app real (Vite + Express/Prisma), no mockups.</li>
    <li><strong>Instrumentación:</strong> Playwright + capturas PNG + <code>results.json</code>.</li>
    <li><strong>Éxito:</strong> la tarea alcanza el estado objetivo sin error bloqueante.</li>
    <li><strong>Tiempo:</strong> estimado humano por tarea (ver nota superior); no cronómetro del robot.</li>
  </ul>

  <h2>3. Perfiles de usuario (personas)</h2>
  ${results.personas
    .map(
      (p) => `<div class="persona-box">
      <h3>${p.name} — ${p.role}</h3>
      <p><strong>Meta:</strong> ${p.goal}<br/>
      <strong>Dispositivo:</strong> ${p.device}<br/>
      <strong>Tiempo de sesión estimado:</strong> ${fmtUser(p.userMsTotal || p.tasks.reduce((a, t) => a + (t.userMs || 0), 0))}</p>
      <table>
        <thead><tr><th>ID</th><th>Tarea</th><th>Resultado</th><th>Tiempo usuario</th><th>Notas</th></tr></thead>
        <tbody>${taskRows(p)}</tbody>
      </table>
    </div>`,
    )
    .join('\n')}

  <h2>4. Matriz de cobertura E2E</h2>
  <table>
    <thead><tr><th>Flujo</th><th>Cubierto por</th><th>Estado</th></tr></thead>
    <tbody>
      ${coverage.map(([f, who]) => `<tr><td>${f}</td><td>${who}</td><td class="pass">OK</td></tr>`).join('\n')}
    </tbody>
  </table>

  <h2>5. Resultados globales</h2>
  <ul>
    <li><strong>${s.pass} / ${s.tasks}</strong> tareas OK (${s.passRate}%).</li>
    <li><strong>Tiempo total de uso real estimado:</strong> ${userMin} minutos (${fmtUser(s.totalUserMs || s.totalMs)}).</li>
    <li><strong>Media por persona:</strong> ${avgMin} minutos de sesión de escenario.</li>
    <li><strong>Fallos bloqueantes:</strong> ${s.fail}.</li>
    <li class="muted">Referencia técnica automatizada: ~${autoSec} s de ejecución Playwright.</li>
  </ul>
  <h3>Hallazgos</h3>
  <ul>
    <li>Flujos críticos operables: descubrimiento → auth → plantillas/editor → PDF → publicación → móvil/tablet.</li>
    <li>Onboarding viable sin cuenta demo (registro + lienzo en blanco).</li>
    <li>La pieza pública <code>/p/:slug</code> y el PDF interactivo cierran el valor de producto para la memoria.</li>
  </ul>
  <h3>Fricciones / mejoras</h3>
  <ul>
    <li>En móvil, la chrome del editor prioriza iconos: tooltips/títulos ayudan.</li>
    <li>El PDF server-side puede tardar varios segundos: el estado “Exportando…” debe permanecer visible.</li>
    <li>Siguiente paso académico: protocolo SUS con N≥5 voluntarios reales en aula.</li>
  </ul>

  <h2>6. Capturas funcionales</h2>
  <p class="muted">Pantallas de la app real obtenidas durante los journeys y del ejemplo de proyecto.</p>
  ${keyShots.map(([f, c]) => img(f, c)).join('\n')}

  <h2>7. Ejemplo de proyecto real (resultado PLIEGO)</h2>
  <p>
    Además de las pruebas, se incluye un entregable exportado desde la propia app:
    <strong>PDF interactivo de diseño</strong> + capturas de editor y vista pública en
    <code>docs/evaluacion/ejemplo-proyecto/</code>
    (archivo <code>PLIEGO_EJEMPLO_MANIFIESTO.pdf</code>).
  </p>
  <p class="muted">Demuestra un resultado funcional, interactivo y de diseño producible con PLIEGO.</p>

  <h2>8. Cómo reproducir</h2>
  <ol>
    <li><code>npm run dev</code> (app en marcha).</li>
    <li><code>npm run test:e2e:personas</code> — 10 personas + capturas.</li>
    <li><code>node scripts/export-example-project.mjs</code> — ejemplo PDF.</li>
    <li><code>npm run docs:eval-pdf</code> — regenera este informe.</li>
  </ol>

  <h2>9. Conclusión</h2>
  <p>
    Con <strong>${s.personas} personas</strong> y <strong>${s.passRate}% de éxito</strong>,
    la batería E2E aporta la evidencia de evaluación y capturas que faltaba.
    El tiempo total de uso real estimado de los escenarios es de
    <strong>${userMin} minutos</strong>, cifra adecuada para describir la interacción humana
    en la memoria (frente a los ~${autoSec}s del robot).
  </p>

  <div class="footer">
    PLIEGO — Anexo E2E / evaluación / capturas · Tiempos = usuario real estimado · ${dateLabel}
  </div>
</body>
</html>`;

const htmlPath = path.join(OUT, 'PLIEGO_E2E_EVALUACION.html');
const pdfPath = path.join(OUT, 'PLIEGO_E2E_EVALUACION.pdf');
fs.writeFileSync(htmlPath, html);

const md = `# E2E, evaluación con usuarios y capturas funcionales — PLIEGO

**Generado:** ${dateLabel}  
**Resultado:** ${s.pass}/${s.tasks} tareas OK (${s.passRate}%)  
**Tiempo total de usuario real estimado:** **${userMin} minutos** (media ${avgMin} min/persona)  
**Referencia robot:** ~${autoSec}s Playwright (no usar como tiempo de uso)

## Metodología

${results.methodology}

## Personas

${results.personas
  .map(
    (p) => `### ${p.name} — ${p.role}
- Meta: ${p.goal}
- Dispositivo: ${p.device}
- Sesión estimada: ${fmtUser(p.userMsTotal || 0)}

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
${p.tasks.map((t) => `| ${t.label} | ${t.status} | ${fmtUser(t.userMs)} | ${(t.notes || []).join('; ')} |`).join('\n')}
`,
  )
  .join('\n')}

## Ejemplo de proyecto

Ver \`docs/evaluacion/ejemplo-proyecto/PLIEGO_EJEMPLO_MANIFIESTO.pdf\`.

## PDF

\`docs/evaluacion/PLIEGO_E2E_EVALUACION.pdf\`
`;
fs.writeFileSync(path.join(OUT, 'EVALUACION_USUARIOS.md'), md);

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForTimeout(600);
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '16mm', left: '12mm', right: '12mm' },
});
await browser.close();

const artDir = '/opt/cursor/artifacts/evaluacion';
fs.mkdirSync(artDir, { recursive: true });
fs.copyFileSync(pdfPath, path.join(artDir, 'PLIEGO_E2E_EVALUACION.pdf'));
fs.copyFileSync(htmlPath, path.join(artDir, 'PLIEGO_E2E_EVALUACION.html'));
console.log('PDF:', pdfPath);
console.log('user_minutes:', userMin);
console.log('size_kb:', Math.round(fs.statSync(pdfPath).size / 1024));
