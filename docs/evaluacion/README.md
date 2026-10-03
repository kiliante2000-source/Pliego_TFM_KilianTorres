# Evaluación E2E y usabilidad — PLIEGO

Anexo para la memoria del TFM: **E2E**, **evaluación con usuarios (10 personas)**, **capturas funcionales** y **ejemplo de proyecto real**.

| Artefacto | Descripción |
|---|---|
| [PLIEGO_E2E_EVALUACION.pdf](./PLIEGO_E2E_EVALUACION.pdf) | **Informe para la memoria** (metodología, 10 personas, tiempos de usuario real, capturas) |
| [EVALUACION_USUARIOS.md](./EVALUACION_USUARIOS.md) | Versión Markdown |
| [results.json](./results.json) | Resultados machine-readable |
| [capturas/](./capturas/) | Screenshots por persona/tarea |
| [ejemplo-proyecto/](./ejemplo-proyecto/) | PDF interactivo real exportado desde PLIEGO + ficha |

## Tiempos

El **tiempo total** del informe es **tiempo de usuario real estimado** (lectura, decisión, interacción, espera de export), no la duración del robot Playwright.

- Última corrida: **~36,7 minutos** acumulados · media **~3,7 min** por persona · **34/34** tareas OK.

## Reproducir

```bash
npm run dev
npm run test:e2e:personas          # 10 personas + capturas
node scripts/export-example-project.mjs
npm run docs:eval-pdf              # regenera el PDF
```
