# PLIEGO — estudio editorial visual

Producto SaaS para crear, gestionar, versionar, exportar (PDF) y publicar proyectos editoriales desde el navegador.

Tipografía expuesta, mesh neón y motion de estudio creativo, con canvas real: capas, autoguardado, versiones, PDF y publicación.

**Repositorio:** [github.com/kiliante2000-source/Pliego_TFM_KilianTorres](https://github.com/kiliante2000-source/Pliego_TFM_KilianTorres)

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React, TypeScript, Vite, Zustand, Tailwind CSS, Framer Motion, Konva |
| Backend | Node.js, Express, TypeScript, Prisma, Zod, JWT (cookie httpOnly) |
| Persistencia | SQLite (dev/demo) · MySQL 8 documentado para producción |
| PDF | Puppeteer / Chrome headless |
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
├── docker/            # Dockerfiles
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

## Docker (opcional)

Con Docker Desktop / Engine:

```bash
docker compose up --build
```

- Web: http://localhost  
- API: http://localhost:45322/api/health

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Base de datos](docs/DATABASE.md)
- [Roadmap](docs/ROADMAP.md)

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
