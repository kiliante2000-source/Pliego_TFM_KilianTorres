# PLIEGO — Backend

API Express + Prisma + JWT del estudio editorial.

## Arranque

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

API: [http://127.0.0.1:45322](http://127.0.0.1:45322)  
Health: [http://127.0.0.1:45322/api/health](http://127.0.0.1:45322/api/health)

## Scripts

```bash
npm run dev          # API en watch
npm run db:seed      # usuario demo + plantillas
npm test             # tests
npm run build        # compilar TypeScript
```

Cuenta demo: `demo@pliego.app` / `demo1234`

Guía completa: [README raíz](../README.md).
