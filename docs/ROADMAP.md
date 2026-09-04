# Roadmap de implementación — Pliego

## Completado

### Fase 1 — Fundación
- Monorepo `frontend/` + `backend/`
- Prisma + SQLite (MySQL documentado)
- Docker Compose + Nginx
- Documentación de arquitectura

### Fase 2 — Usuarios
- Registro / login / logout
- JWT en cookie httpOnly
- Rate limiting en auth
- Rutas protegidas

### Fase 3 — Proyectos
- CRUD completo
- Duplicar / archivar / eliminar
- Plantillas (portada, revista, catálogo, presentación)

### Fase 4 — Editor
- Canvas Konva + react-konva
- Texto, formas, imágenes
- Capas, páginas, propiedades
- Zoom, selección, transformaciones
- Undo / redo / copiar / pegar / eliminar

### Fase 5 — Persistencia
- Autoguardado con debounce
- Indicador Guardando / Guardado / Error
- Versiones manuales + restauración

### Fase 6 — PDF
- Render HTML print-ready
- Puppeteer → descarga

### Fase 7 — Publicación
- Slug público `/p/:slug`
- Activar / desactivar publicación

### Fase 8 — Calidad
- Vitest (front + back)
- GitHub Actions CI
- README + docs

## Siguiente evolución (fuera del slice actual)
- Colaboración en tiempo real
- Assets en object storage (S3)
- Bloques reutilizables en servidor
- E2E Playwright ampliado
- Migración completa a MySQL en Compose
