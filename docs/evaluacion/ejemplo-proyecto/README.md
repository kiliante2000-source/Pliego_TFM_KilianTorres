# Ejemplo de proyecto PLIEGO — resultado real

Pieza generada desde la app para la memoria del TFM: demuestra un entregable
**funcional, interactivo y de diseño** producido con PLIEGO.

## Datos

| Campo | Valor |
|---|---|
| Título | Ejemplo TFM — Manifiesto PLIEGO |
| Project ID | `cmusnxhvt000rpdg91ohyrthu` |
| Slug público | /p/ejemplo-tfm-manifiesto-pliego-s90uzo |
| Formato | 1440 × 900 |
| Plantilla origen | manifesto-digital / colección PLIEGO |
| Entregable PDF | [PLIEGO_EJEMPLO_MANIFIESTO.pdf](./PLIEGO_EJEMPLO_MANIFIESTO.pdf) |

## Qué demuestra

1. **Diseño editorial** en canvas Konva (tipografía, composición, identidad PLIEGO).
2. **Interactividad en PDF**: CTAs/enlaces anotados (GoTo/URI) vía pipeline Puppeteer + pdf-lib.
3. **Publicación web** opcional en `/p/:slug` (vista viva, no solo archivo).
4. **Reproducibilidad**: se puede volver a exportar con la cuenta demo o el script
   `node scripts/export-example-project.mjs`.

## Capturas

- `ejemplo-editor.png` — pieza abierta en el estudio
- `ejemplo-publico.png` — vista pública
- `PLIEGO_EJEMPLO_MANIFIESTO.pdf` — descarga del resultado

## Cómo se hizo (pasos de producto)

1. Login en el estudio (`demo@pliego.app`).
2. Abrir plantilla de la colección (Manifiesto / Portada).
3. (Opcional) Ajustar textos/capas en el editor.
4. Pulsar **PDF interactivo** o ejecutar este script.
5. Publicar y compartir `/p/:slug`.
