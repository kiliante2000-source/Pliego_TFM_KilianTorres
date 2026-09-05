# Pliego — estudio editorial visual

Producto SaaS para crear, gestionar, versionar, exportar (PDF) y publicar proyectos editoriales desde el navegador.

La interfaz busca la energía de estudios creativos digitales (tipografía expuesta, mesh neón, microinteracciones y motion) sin perder utilidad: canvas, capas, autoguardado, versiones, PDF y publicación.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React, TypeScript, Vite, Zustand, Tailwind CSS, Framer Motion, Konva |
| Backend | Node.js, Express, TypeScript, Prisma, Zod, JWT (cookie httpOnly) |
| Persistencia | SQLite (dev/demo) · MySQL 8 listo para producción (ver docs) |
| PDF | Puppeteer / Chrome headless |
| Infra | Docker Compose, Nginx, GitHub Actions |

## Arranque local

Requisitos: Node.js 20+

```bash
# Backend
cd backend
cp .env.example .env   # si no existe .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev            # http://127.0.0.1:45322

# Frontend (otra terminal)
cd frontend
npm install
npm run dev            # http://127.0.0.1:45321
```

Cuenta demo tras el seed:

- Email: `demo@pliego.app`
- Contraseña: `demo1234`

## Scripts útiles

```bash
# tests
cd backend && npm test
cd frontend && npm test

# build
cd frontend && npm run build
cd backend && npm run build
```

## Docker

```bash
docker compose up --build
```

- Web: http://localhost
- API: http://localhost:45322/api/health

## Arquitectura

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Fases implementadas

1. Monorepo + Docker + DB
2. Auth (registro, login, cookies JWT, rutas protegidas)
3. CRUD de proyectos + plantillas
4. Editor visual Konva (páginas, capas, propiedades, undo/redo)
5. Autoguardado + versiones
6. Exportación PDF
7. Publicación pública `/p/:slug`
8. Tests + CI

## Licencia

Proyecto de demostración / TFM — uso educativo y portfolio.
