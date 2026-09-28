# PLIEGO — Frontend

Interfaz React del estudio editorial (Vite + TypeScript + Tailwind + Zustand + Konva).

## Arranque

Primero deja el **backend** en marcha (`cd backend && npm run dev`).

```bash
cd frontend
npm install
npm run dev
```

Abre [http://127.0.0.1:45321](http://127.0.0.1:45321).

Las peticiones `/api` se proxifican a `http://127.0.0.1:45322`.

## Scripts

```bash
npm run dev      # desarrollo
npm test         # tests
npm run build    # build de producción
npm run preview  # previsualizar el build
```

La guía completa está en el [README raíz](../README.md).
