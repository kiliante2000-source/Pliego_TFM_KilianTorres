# Arquitectura — Editorial Studio

Plataforma web full stack para creación, gestión y publicación de proyectos editoriales digitales.

## 1. Visión de producto

Producto SaaS situado entre InDesign (maquetación profesional) y Canva (simplicidad visual). El usuario gestiona el ciclo de vida completo: documento → diseño → versiones → exportación PDF → publicación pública.

Identidad: tipografía editorial, contraste alto, interfaz oscura tipo estudio creativo (Figma / Linear), no estética académica genérica.

## 2. Decisión de canvas: Konva.js + react-konva

| Criterio | Konva + react-konva | Fabric.js |
|---|---|---|
| Integración React | Declarativa (componentes) | Imperativa (refs/mutaciones) |
| Capas / z-index | Stage → Layer → Node nativo | Posible, más manual |
| TypeScript | Tipado maduro con `@types` / react-konva | Más fricción |
| Estado inmutable | Encaja con Zustand + undo/redo | Modelo mutable del canvas |
| Serialización JSON | Control total desde nuestro modelo `Element` | Depende del objeto Fabric |
| Rendimiento multi-página | Buen control de re-render por página | Canvas monolítico |

**Elección: Konva.js + react-konva.** El modelo de dominio (`TextElement | ImageElement | ShapeElement | BackgroundElement`) vive en Zustand; Konva solo renderiza. Así el undo/redo, autoguardado y versionado operan sobre JSON propio, no sobre el runtime del canvas.

## 3. Arquitectura del sistema

```
┌─────────────┐     HTTPS/JSON      ┌──────────────────┐
│  Frontend   │ ◄─────────────────► │  Backend API     │
│  Vite+React │   Cookie JWT        │  Express + TS    │
│  Zustand    │                     │  Controllers →   │
│  Konva      │                     │  Services →      │
└─────────────┘                     │  Repositories    │
                                    └────────┬─────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
              ┌──────────┐            ┌──────────┐             ┌──────────┐
              │  Prisma  │            │  Assets  │             │Puppeteer │
              │  MySQL*  │            │  disk/S3 │             │  PDF     │
              └──────────┘            └──────────┘             └──────────┘
```

\* En desarrollo local: SQLite (mismo esquema Prisma adaptado). En Docker Compose / producción: MySQL 8.

### Capas backend (Clean Architecture ligera)

- **Routes** — HTTP binding + middleware
- **Controllers** — parseo / respuesta HTTP
- **Services** — reglas de negocio
- **Repositories** — Prisma / filesystem
- **Validators** — Zod
- **Middleware** — auth, rate-limit, error handler

### Capas frontend

- **routes/** — React Router (auth, app, public)
- **stores/** — Zustand (auth, editor, UI)
- **services/** — cliente API tipado
- **components/editor/** — canvas, toolbar, properties, pages, layers
- **types/** — contrato compartido del documento JSON

## 4. Modelo de documento (contrato JSON)

```ts
type DocumentModel = {
  version: 1;
  pages: Page[];
  meta: { title: string; width: number; height: number };
};

type Page = {
  id: string;
  name: string;
  order: number;
  background: BackgroundElement;
  elements: CanvasElement[];
};

type CanvasElement =
  | TextElement
  | ImageElement
  | ShapeElement;
```

Cada elemento incluye `x, y, width, height, rotation, scaleX, scaleY, opacity, zIndex` y se serializa íntegramente para autoguardado / versiones / PDF.

## 5. Seguridad

- Contraseñas: bcrypt (cost 12)
- Sesión: JWT en cookie `httpOnly`, `Secure` (prod), `SameSite=Lax`
- Validación: Zod en body/query
- Helmet + CORS restrictivo + rate limiting en auth
- Autorización: el owner del proyecto (y roles admin) controla mutaciones
- Assets: whitelist MIME, límite de tamaño, nombres no controlados por el cliente
- Publicación: solo proyectos con `visibility=public` y `published=true`

## 6. Persistencia y versiones

- Documento vivo en `projects.documentJson` (último estado)
- Autoguardado frontend: debounce ~800 ms → `PATCH /projects/:id/document`
- Versiones manuales en `project_versions` (snapshot completo + autor + fecha)
- Restaurar: copia el snapshot al documento vivo y crea versión “restore”

## 7. Exportación PDF

1. Auth + ownership
2. Servicio carga documento + assets
3. Render HTML print-ready (mismas dimensiones en mm/px)
4. Puppeteer headless → PDF
5. Registro en `exports` + descarga

## 8. Infraestructura

- **Dev:** Vite `:45321` + API `:45322` + SQLite (o MySQL en Compose)
- **Prod:** Docker Compose → Nginx (estáticos + proxy) → API → MySQL + volumen assets
- **CI:** GitHub Actions — lint, unit, build, e2e smoke

## 9. Roadmap de implementación

| Fase | Entrega |
|------|---------|
| 1 | Monorepo, Docker, frontend, backend, DB, docs |
| 2 | Auth (registro, login, logout, sesión, rutas) |
| 3 | CRUD proyectos, dashboard, plantillas base |
| 4 | Editor Konva (páginas, elementos, capas, props, undo) |
| 5 | Autoguardado + versiones |
| 6 | Exportación PDF |
| 7 | Publicación pública por slug |
| 8 | Tests, CI/CD, hardening, README |

## 10. Mejoras de producto (respecto al TFM)

- Undo/redo, copy/paste, delete
- Plantillas iniciales (portada, revista, catálogo, presentación)
- Modo oscuro de estudio por defecto
- Microinteracciones (Framer Motion)
- Indicador de guardado no bloqueante
- Bloques reutilizables (favoritos locales → API en evolución)
