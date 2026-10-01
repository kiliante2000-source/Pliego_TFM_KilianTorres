# Producto — PLIEGO

Visión, alcance, stack operativo y mapa de valor del estudio editorial visual.
Complementa [ARCHITECTURE.md](./ARCHITECTURE.md), [DATABASE.md](./DATABASE.md) y [ROADMAP.md](./ROADMAP.md).

## Qué es PLIEGO

**PLIEGO** es un estudio editorial visual en el navegador: creas revistas, portadas, lookbooks y presentaciones con un canvas real (capas, tipografía, motion, CTAs), autoguardas, versionas, exportas **PDF interactivo** y publicas un enlace `/p/:slug`.

Posicionamiento documentado: *entre InDesign (control tipográfico/editorial) y Canva (facilidad)*, con estética de estudio creativo (oscuro, neón, tipografía display), no de panel genérico.

- Tagline de producto: *estudio editorial visual*
- Claim de landing: *“Diseña revistas, portadas y sistemas visuales con la fluidez de un estudio creativo.”*
- Demo viva: *“No es un panel. No es otra herramienta. Es una portada que late.”*

---

## Finalidad y valor

### Finalidad
Permitir que un diseñador / editor / estudiante produzca **piezas editoriales digitales publicables** (no solo mockups estáticos) sin instalar InDesign ni quedarse en plantillas rígidas tipo Canva.

### Productos / entregables que aporta
| Entregable | Qué es |
|---|---|
| Proyecto en editor | Lienzo multi-página con elementos tipográficos, formas, imagen, botón, vídeo |
| Plantillas PLIEGO | 6 plantillas con 3 actos (portada / cuerpo / cierre) |
| Versiones | Snapshots manuales restaurables del JSON del documento |
| PDF interactivo | Descarga con enlaces GoTo entre páginas y URI externas |
| Publicación web | URL pública `/p/:slug` con vista zoomable |
| Demo viva | Experiencia de marketing/producto en `/demo` |
| Identidad de marca embebida | Tokens, tipografías, bloques editoriales, swatches |

### Quién lo usaría
- Estudiantes de diseño / comunicación visual
- Estudios pequeños que publican lookbooks o decks
- Marcas culturales / editoriales que necesitan un link vivo, no un PDF plano
- El propio autor del TFM como portfolio demostrable

---

## Qué hace y qué no hace

### Sí hace (implementado)
1. Registro / login / logout / sesión por cookie JWT  
2. CRUD de proyectos (crear, listar, duplicar, archivar, eliminar)  
3. Plantillas + lienzo en blanco (story, square, landscape, presentation)  
4. Editor Konva: páginas, capas, propiedades, zoom, transform, undo/redo (50), copy/paste  
5. Texto, formas (rect/ellipse + gradientes), imagen, botón (CTA), vídeo (placeholder + link)  
6. Animaciones preset (fade, scale, slide, blur…) al load/scroll en vista pública  
7. Interacciones `pliego:next|prev|page:…`, URLs, mailto, paths  
8. Autoguardado debounce ~800 ms + indicador idle/saving/saved/error  
9. Versiones manuales + restore  
10. Subida de imágenes (JPEG/PNG/WebP/GIF ≤ 5 MB)  
11. Exportación PDF en servidor (Puppeteer + pdf-lib)  
12. Publicar / despublicar por slug  
13. Demo viva + landing con identidad PLIEGO  
14. Tests unitarios + CI GitHub Actions  
15. Deploy Render (Node) + Docker opcional  

### No hace (fuera del slice / no existe en código)
- Colaboración en tiempo real / multiplayer  
- Pagos, planes, Stripe, billing  
- Object storage S3 (assets en disco local del servidor)  
- Conflictos multi-pestaña (último guardado gana)  
- Cola de jobs para PDFs / límites duros de páginas  
- Migración automática de esquemas JSON antiguos  
- Admin bypass real pese a campo `role`  
- Suite E2E Playwright amplia  
- Auditoría WCAG formal  
- PostgreSQL en el deploy free actual (sigue SQLite efímera en Render)

---

## Cómo está construida

### Monorepo
```
Pliego_TFM_KilianTorres/
├── frontend/     React 19 + Vite + Zustand + Tailwind + Konva + Framer Motion
├── backend/      Express 5 + Prisma + Zod + JWT + Puppeteer + pdf-lib
├── docs/         Producto, arquitectura, DB, FAQ, roadmap
├── docker/       Compose / Nginx
├── render.yaml   Blueprint Render free (runtime Node)
└── scripts/      start-web (sirve API + estáticos del build)
```

### Flujo de datos
```
UI (React) → Zustand editorStore → API (cookie JWT)
                                → Prisma (User, Project.documentJson, Versions, Assets, Exports)
                                → Disco (uploads/, exports/)
Export PDF: documentJson → HTML escapado → Chromium headless → pdf-lib anota links → fichero
Public: GET /api/public/:slug → PublicRenderer / ZoomablePublicView
```

### Modelo de documento (contrato)
```ts
DocumentModel {
  version: 1
  pages: Page[]
  meta: { title, width, height, templateId?, templateName? }
}
Page { id, name, order, background, elements[] }
CanvasElement = Text | Image | Shape | Button | Video
// + effects, animation, interaction
```

Persistencia viva: una columna `projects.documentJson` (string JSON).  
Versiones: tabla `ProjectVersion` con snapshot completo.

### Stack y porqués cortos
| Pieza | Elección |
|---|---|
| Canvas | Konva + react-konva (declarativo, capas, encaja con Zustand) |
| Estado | Zustand (ligero, JSON-first, undo stack simple) |
| API | Express + capas routes/controllers/services/repositories |
| Validación | Zod |
| Auth | JWT en cookie httpOnly `pliego_token` |
| DB demo | SQLite + WAL |
| PDF | puppeteer-core + system Chrome o `@sparticuz/chromium` en Render |
| UI | Tailwind + tokens `PLIEGO_BRAND` + tipografías Syne / Space Grotesk / DM Sans / Instrument Serif / JetBrains Mono |

### Plantillas (todas 3 páginas)
| ID | Formato |
|---|---|
| manifesto-digital | 1440×900 landscape |
| portfolio-kinetic | 1080×1350 portrait |
| portada-editorial | 1080×1350 |
| revista-doble | 1200×1600 |
| catalogo-producto | 1080×1350 |
| presentacion-slide | 1920×1080 |

### Acciones de usuario (mapa)
**Landing:** Empezar / Login / Registro / Ver demo  
**Dashboard:** Nueva desde plantilla / blank / abrir / duplicar / archivar / eliminar / publicar  
**Editor:** añadir texto/forma/imagen/botón/vídeo · capas · páginas · props · brand swatches · bloques editoriales · undo/redo · zoom (pinch/dock en móvil) · guardar versión · exportar PDF · publicar  
**Público:** navegar páginas, CTAs, motion al scroll, zoom  

### Estética visual
- Fondo ink `#050608` / `#0B0E11`, acentos neón `#4F80FF`, rosa `#FF4EDB`, violeta, lima `#B2FF3A`
- Display **Syne**, UI **Space Grotesk**, body **DM Sans**, metadatos **JetBrains Mono**, voz editorial **Instrument Serif**
- Mesh/gradientes brand-flow, posters de plantilla estáticos (sin flicker), reduce-motion respetado
- Sensación: estudio Figma/Linear + portada de revista digital, no dashboard SaaS genérico

### Código — datos que suelen faltar en la defensa
- ~9.3k líneas TS/TSX de aplicación (front+back, sin node_modules)
- Ownership siempre vía `projectService.getOwned(projectId, ownerId)`
- PDF: `escapeHtml` en textos/labels/URLs embebidas; hotspots `URI` / `GoTo`
- Autosave: `markDirtyAndScheduleSave` → 800 ms → `PATCH .../document`
- History local: `HISTORY_LIMIT = 50`
- Slug: `slugify(title) + '-' + 6 chars base36`
- Uploads: whitelist MIME + `MAX_UPLOAD_BYTES=5242880`
- Render free: SQLite efímera, cold start ~1 min, Chromium vía Sparticuz
- Tests: **11** (9 backend + 2 frontend), todos pasando en local

---

## Despliegue y acceso

| Entorno | URL |
|---|---|
| Local front | http://127.0.0.1:45321 |
| Local API | http://127.0.0.1:45322/api/health |
| Producción (Render) | https://pliego-kr1j.onrender.com |

Health prod verificado: `{"ok":true,"service":"pliego-api","env":"production","db":"up"}`.

Cuenta demo (seed): `demo@pliego.app` / `demo1234`  
Repo: https://github.com/kiliante2000-source/Pliego_TFM_KilianTorres

**Nota free tier:** tras ~15 min idle se duerme; el primer hit puede tardar. Redeploy puede resetear SQLite.

---

## Fortalezas del proyecto

1. **Ciclo completo real:** diseñar → versionar → PDF interactivo → publicar link.  
2. **Modelo de documento propio** (no atado a Fabric/Konva serialization).  
3. **Identidad de producto coherente** (código + UI + plantillas + demo).  
4. **Decisiones técnicas defendibles** (tabla de preguntas abajo).  
5. **Deploy público demostrable**, no solo localhost.  
6. **Seguridad básica bien planteada** (httpOnly, ownership, MIME, escape HTML, rate limit).  
7. **Mobile editor** pensado (dock, zoom, fit one-shot).  
8. **PDF no es “imprimir pantalla”:** anota enlaces para Acrobat/Preview.  

Límites honestos (también es positivo reconocerlos): tests aún pocos, sin collab, SQLite en free, sin cola PDF, a11y parcial.

---

---

## Mapa de archivos clave

| Tema | Archivo |
|---|---|
| Brand tokens | `frontend/src/brand/pliegoBrand.ts` |
| Store editor / autosave | `frontend/src/stores/editorStore.ts` |
| Canvas | `frontend/src/components/editor/EditorCanvas.tsx` |
| Plantillas UI | `frontend/src/components/dashboard/TemplateCards.tsx` |
| Landing | `frontend/src/pages/LandingAuth.tsx` |
| Demo | `frontend/src/pages/LiveDemoPage.tsx` |
| Contrato documento | `frontend/src/types/document.ts` (+ espejo backend) |
| Schema DB | `backend/prisma/schema.prisma` |
| Plantillas server | `backend/src/services/templateService.ts` |
| PDF | `backend/src/services/exportService.ts` |
| Chromium Resolve | `backend/src/utils/chrome.ts` |
| Slug | `backend/src/utils/slug.ts` |
| Auth cookie | `backend/src/controllers/authController.ts` |
| Ownership | `backend/src/services/projectService.ts` |
| Deploy | `render.yaml`, `README.md` |

---

## Síntesis

> PLIEGO no es un clon de Canva: es un estudio editorial en el navegador con un contrato de documento propio, identidad visual coherente, publicación viva y PDF interactivo — un ciclo completo defendible como producto y como ingeniería, con límites conscientes de un TFM (SQLite demo, sin collab, tests aún creciendo).
