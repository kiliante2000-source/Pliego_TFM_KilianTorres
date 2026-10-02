# Evaluación E2E y usabilidad — PLIEGO

Anexo para la memoria del TFM: journeys con perfiles de usuario, capturas funcionales y PDF descargable.

| Artefacto | Descripción |
|---|---|
| [PLIEGO_E2E_EVALUACION.pdf](./PLIEGO_E2E_EVALUACION.pdf) | **Informe listo para la memoria** (metodología, personas, resultados, capturas) |
| [EVALUACION_USUARIOS.md](./EVALUACION_USUARIOS.md) | Versión Markdown del informe |
| [results.json](./results.json) | Resultados machine-readable de la última corrida |
| [capturas/](./capturas/) | Screenshots por persona/tarea |

## Reproducir

```bash
# App en marcha (puertos 45321 / 45322 por defecto)
npm run dev

# Journeys E2E por personas + capturas
node scripts/persona-e2e-eval.mjs

# Regenerar PDF / Markdown
node scripts/build-eval-pdf.mjs
```

Variable opcional: `PLIEGO_BASE_URL=http://127.0.0.1:45321`
