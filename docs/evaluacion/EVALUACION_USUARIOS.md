# Evaluación E2E y usabilidad por escenarios — PLIEGO

**Generado:** 2 de octubre de 2026, 18:27  
**Base:** http://127.0.0.1:45321  
**Resultado:** 14/14 tareas OK (100%)

## Metodología

Evaluación por escenarios con perfiles (personas). Cada persona ejecuta tareas guiadas sobre la app real; se registran éxito/fracaso, tiempo y fricciones observadas.

Tipo: evaluación task-based con 4 personas sobre la app real (Playwright/Chromium).  
Script: `node scripts/persona-e2e-eval.mjs` · PDF: `node scripts/build-eval-pdf.mjs`

## Personas y tareas

### Ana Ruiz — Diseñadora freelance
- **Meta:** Abrir una plantilla, editar en el estudio y exportar PDF interactivo
- **Dispositivo:** Desktop 1440×900

| Tarea | Resultado | Tiempo | Notas |
|---|---|---|---|
| Descubre PLIEGO en la landing | pass | 1.9s | Landing carga con identidad de marca reconocible |
| Inicia sesión con cuenta demo | pass | 2.1s | Login → /app sin fricción |
| Explora la colección de plantillas | pass | 1.8s | 6 plantillas visibles con vectores animados |
| Abre plantilla Manifiesto en el editor | pass | 1.6s | Editor abierto: http://127.0.0.1:45321/app/editor/cmuraphm90005pdg9x700wu58 |
| Exporta PDF interactivo | pass | 3.0s | Descarga iniciada: Manifiesto_digital.pdf |

### Luis Ortega — Estudiante de diseño
- **Meta:** Ver la demo viva, registrarse y crear un lienzo en blanco
- **Dispositivo:** Desktop 1280×800

| Tarea | Resultado | Tiempo | Notas |
|---|---|---|---|
| Recorre la demo viva | pass | 1.9s | Demo viva accesible sin login |
| Crea una cuenta nueva | pass | 1.6s | Cuenta creada: luis.eval.1790965656758@pliego.test |
| Abre un lienzo en blanco (Story) | pass | 2.5s | Lienzo Story abierto desde portal en blanco |

### Marta Gil — Community / social media
- **Meta:** Usar PLIEGO en móvil: plantillas legibles y editor compacto
- **Dispositivo:** iPhone 13 (390×844)

| Tarea | Resultado | Tiempo | Notas |
|---|---|---|---|
| Entra al estudio desde el móvil | pass | 2.9s | Studio usable en viewport móvil |
| Revisa plantillas en móvil | pass | 3.1s | Animación vector: pliego-vector-float |
| Abre plantilla en editor compacto | pass | 1.7s | Editor compacto en 390px |

### Carlos Méndez — Editor de marca cultural
- **Meta:** Publicar un proyecto y verificar la vista pública
- **Dispositivo:** Desktop 1365×900

| Tarea | Resultado | Tiempo | Notas |
|---|---|---|---|
| Abre un proyecto existente del estudio | pass | 4.2s | Proyecto abierto desde listado |
| Publica o confirma publicación | pass | 1.8s | Estado publicado visible |
| Visita la URL pública /p/:slug | pass | 1.9s | Vista pública OK: /p/manifiesto-digital-kjmle3 |


## Capturas

Ver carpeta `docs/evaluacion/capturas/` y el PDF `PLIEGO_E2E_EVALUACION.pdf`.

## Conclusión

Flujos críticos (landing, auth, plantillas, editor, PDF, publicación, móvil) validados con 100% de éxito en esta batería.
