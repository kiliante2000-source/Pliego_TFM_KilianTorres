# PLIEGO — estudio editorial visual

Producto SaaS para crear, gestionar, versionar, exportar (PDF) y publicar proyectos editoriales desde el navegador.

Tipografía expuesta, mesh neón y motion de estudio creativo, con canvas real: capas, autoguardado, versiones, PDF y publicación.

**Repositorio:** [github.com/kiliante2000-source/Pliego_TFM_KilianTorres](https://github.com/kiliante2000-source/Pliego_TFM_KilianTorres)

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React, TypeScript, Vite, Zustand, Tailwind CSS, Framer Motion, Konva |
| Backend | Node.js, Express, TypeScript, Prisma, Zod, JWT (cookie httpOnly) |
| Persistencia | SQLite + WAL (dev/demo) · PostgreSQL recomendado en producción |
| PDF | Puppeteer / Chrome headless + pdf-lib (enlaces URI / GoTo) |
| Infra | Docker Compose, Nginx, GitHub Actions |

## Arranque rápido (local)

Requisitos: **Node.js 20+** y npm.

### 1. Clonar

```bash
git clone https://github.com/kiliante2000-source/Pliego_TFM_KilianTorres.git
cd Pliego_TFM_KilianTorres
```

### 2. Backend (terminal 1)

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

API en: [http://127.0.0.1:45322](http://127.0.0.1:45322)  
Health: [http://127.0.0.1:45322/api/health](http://127.0.0.1:45322/api/health)

### 3. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

App en: [http://127.0.0.1:45321](http://127.0.0.1:45321)

### Cuenta demo

Tras el seed:

| Campo | Valor |
|-------|-------|
| Email | `demo@pliego.app` |
| Contraseña | `demo1234` |

## Estructura

```
Pliego_TFM_KilianTorres/
├── frontend/          # React + Vite (puerto 45321)
├── backend/           # API Express + Prisma (puerto 45322)
├── docs/              # Arquitectura, base de datos, roadmap
├── docker/            # entrypoint + Dockerfiles compose
├── Dockerfile         # imagen all-in-one (Render / Docker)
├── render.yaml        # Blueprint Render (plan free)
└── docker-compose.yml
```

## Scripts útiles

```bash
# Tests
cd backend && npm test
cd frontend && npm test

# Build de producción
cd backend && npm run build
cd frontend && npm run build
```

## Despliegue gratis (sin github.io)

Tu portfolio en GitHub Pages puede seguir igual. PLIEGO se despliega aparte en **Render** (plan free, runtime Node) con URL propia tipo `https://pliego-xxxx.onrender.com`.

### Un clic (recomendado)

1. Sube este repo a GitHub (si aún no está al día).
2. Abre: [Deploy to Render](https://render.com/deploy?repo=https://github.com/kiliante2000-source/Pliego_TFM_KilianTorres)
3. Blueprint Name: `pliego` → **Deploy Blueprint**.
4. Cuando el servicio quede **Live**, abre la URL `*.onrender.com` que te den.
5. Si un sync falla, abre el servicio **pliego** → pestaña **Logs** / **Events** para ver el error, o pulsa **Manual sync** tras un fix en `main`.

Cuenta demo en producción (tras el seed automático):

| Campo | Valor |
|-------|-------|
| Email | `demo@pliego.app` |
| Contraseña | `demo1234` |

**Notas del plan free:** el servicio se duerme tras ~15 min sin tráfico (el primer cargado puede tardar ~1 min). La base SQLite es efímera: tras un redeploy o reinicio frío puede volver a la demo. No toca tu dominio `github.io`.

### Blueprint manual

En [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** → elige este repositorio (usa el `render.yaml` de la raíz).

### Docker local (imagen all-in-one)

```bash
docker build -t pliego .
docker run --rm -p 45322:45322 \
  -e JWT_SECRET=cambia-este-secreto-largo \
  -e CORS_ORIGIN=http://127.0.0.1:45322 \
  -e FRONTEND_URL=http://127.0.0.1:45322 \
  pliego
```

App: http://127.0.0.1:45322

### Docker Compose (opcional)

```bash
docker compose up --build
```

- Web: http://localhost  
- API: http://localhost:45322/api/health

## Documentación

Índice: [docs/README.md](docs/README.md)

- [Producto](docs/PRODUCT.md) — alcance, plantillas, identidad, deploy
- [Arquitectura](docs/ARCHITECTURE.md) — canvas, auth, PDF, capas
- [Base de datos](docs/DATABASE.md) — SQLite / Postgres
- [FAQ y decisiones](docs/FAQ.md) — porqués técnicos y de producto
- [Roadmap](docs/ROADMAP.md) — fases y siguiente evolución
- [Contexto de desarrollo](docs/DEV_CONTEXT.md)

## Fases implementadas

1. Monorepo + Docker + DB  
2. Auth (registro, login, cookies JWT, rutas protegidas)  
3. CRUD de proyectos + plantillas  
4. Editor visual Konva (páginas, capas, propiedades, undo/redo)  
5. Autoguardado + versiones  
6. Exportación **PDF interactivo** (CTAs con GoTo entre páginas y URI externas vía pdf-lib)  
7. Publicación pública `/p/:slug`  
8. Tests + CI  

## Licencia

Proyecto de demostración / TFM — uso educativo y portfolio.
