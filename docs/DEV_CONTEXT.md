# Contexto de desarrollo — PLIEGO

Contexto mínimo del proyecto antes de tocar código. No inventar features fuera de
alcance (no colaboración en tiempo real, no pagos, no S3 en el slice actual).

## Resumen técnico

- **Stack:** React + Vite + Zustand + Konva / Express + Prisma + SQLite /
  PDF Puppeteer + pdf-lib / publicación `/p/:slug` / deploy Render.
- **Documento:** JSON `version:1` con `pages[].elements`
  (`text|image|shape|button|video` + effects/animation/interaction).
- **Auth:** JWT en cookie httpOnly `pliego_token`; ownership por `ownerId`.
- **Editor:** autosave ~800 ms; sin sync multi-tab. Plantillas de 3 actos.
- **Identidad:** Syne / Space Grotesk / DM Sans / JetBrains Mono;
  neón `#4F80FF`, rosa `#FF4EDB`, ink `#050608`.
- **Prioridades:** fidelidad del editor, PDF en Render (`@sparticuz/chromium`),
  coherencia de marca.

Lee `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`,
`docs/FAQ.md`, `docs/ROADMAP.md` y el código antes de proponer cambios.

## Docs de referencia

| Doc | Contenido |
|---|---|
| [PRODUCT.md](./PRODUCT.md) | Qué es, alcance, plantillas, estética, deploy |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Capas, Konva, auth, PDF pipeline |
| [DATABASE.md](./DATABASE.md) | SQLite/Postgres, índices, listados |
| [FAQ.md](./FAQ.md) | Decisiones y preguntas de defensa |
| [ROADMAP.md](./ROADMAP.md) | Fases hechas y siguientes |
