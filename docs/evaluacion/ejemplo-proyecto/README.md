# Ejemplo de proyecto PLIEGO — Manifiesto interactivo

Entregable real para la memoria del TFM: pieza **funcional, interactiva y de diseño**
producida con PLIEGO (plantilla `manifesto-digital` rediseñada).

## Datos

| Campo | Valor |
|---|---|
| Título | Ejemplo TFM — Manifiesto PLIEGO |
| Project ID | `cmuso2ryp0003cf6et2xi40x3` |
| Slug público | `/p/ejemplo-tfm-manifiesto-pliego-cfa9hz` |
| Formato | 1440 × 900 |
| PDF | [PLIEGO_EJEMPLO_MANIFIESTO.pdf](./PLIEGO_EJEMPLO_MANIFIESTO.pdf) |
| Exportado | 2026-10-03T17:29:39.978Z |

## Estructura (3 actos)

1. **Portada** — marca, display tipográfico, CTAs a ensayo/cierre  
2. **Ensayo** — columna ink + columna editorial, quote, navegación  
3. **Cierre** — llamada final con enlaces de retorno entre páginas  

Los botones usan `pliego:page:…` (navegación real entre actos) y se conservan
como anotaciones en el **PDF interactivo**.

## Capturas

- `acto-01-portada.png` · `acto-02-ensayo.png` · `acto-03-cierre.png`
- `ejemplo-editor.png` · `ejemplo-publico.png`

## Cómo regenerar

```bash
npm run dev
node scripts/export-example-project.mjs
```
