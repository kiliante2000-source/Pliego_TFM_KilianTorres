# FAQ y decisiones de diseño — PLIEGO

Respuestas técnicas y de producto para defensa TFM y onboarding.
Ver también [PRODUCT.md](./PRODUCT.md) y [ARCHITECTURE.md](./ARCHITECTURE.md).

### ¿Por qué SQLite y no PostgreSQL o MySQL?
Para el TFM/demo: cero ops, un fichero, Prisma idéntico, WAL para lecturas concurrentes ligeras. El schema y `docs/DATABASE.md` están preparados para cambiar `provider` a `postgresql` o `mysql` sin rediseñar entidades. En Render free, SQLite es lo pragmático (aunque **efímera** entre redeploys). En producción seria: PostgreSQL gestionado.

### ¿Por qué guardas el documento como JSON y no en tablas (páginas, elementos)?
Porque el documento es un **grafo editorial flexible** (tipos heterogéneos, effects, animation, interaction, zIndex). Normalizarlo a filas explotaría en JOINs y migraciones por cada prop nueva. El JSON es el contrato del editor, del undo, de las versiones y del PDF. Las tablas relacionales guardan lo estable: User, Project, Version, Asset, Export.

### Si mañana cambias el formato del JSON, ¿qué pasa con los documentos antiguos?
Hoy el contrato exige `version: 1` (`isDocumentModel`). **No hay migrador automático aún.** Estrategia correcta a documentar:
1. Subir `meta.version` / `document.version` a 2.  
2. Función `migrateDocument(doc)` en load (API + frontend).  
3. Reescribir al guardar.  
Sin eso, un cambio breaking devolvería “documento inválido”. Las versiones antiguas en `ProjectVersion` seguirían en v1 hasta migrarlas.

### ¿Por qué Konva y no Fabric.js o canvas a mano?
Documentado en `docs/ARCHITECTURE.md`: Konva + react-konva es **declarativo en React**, capas nativas, buen TypeScript, y el estado vive en Zustand (inmutable) en lugar del modelo mutable de Fabric. Canvas a mano implicaría reimplementar hit-testing, transformadores, capas y DPI. Konva renderiza; el dominio es nuestro JSON.

### ¿Por qué exportas en el servidor con Puppeteer y no en el cliente?
- Mismas fuentes/medidas en un Chromium controlado.  
- No dependes del navegador del usuario ni de popups/print dialog.  
- Puedes anotar el PDF con pdf-lib (GoTo/URI) de forma fiable.  
- En cliente: peso enorme, inconsistencia tipográfica, y peor control de seguridad de assets.  
En Render sin apt: `@sparticuz/chromium` resuelve el binario.

### ¿El PDF sale igual que el lienzo?
**Muy fiel, no pixel-perfect.** El pipeline re-renderiza el documento a HTML/CSS absolutos con las mismas medidas `width×height`, tipografías de Google Fonts y gradientes. Diferencias posibles: antialiasing Konva vs Chromium, vídeos (marcador), algunos blend modes/effects, fuentes si fallan a cargar (hay espera corta post-`load`). Los CTAs sí se refuerzan como anotaciones PDF.

### ¿Qué pasa si dos personas exportan a la vez, o si el PDF tiene 50 páginas?
- **No hay cola:** cada export lanza un Chromium. Dos a la vez = dos procesos (en free tier: riesgo de OOM / timeout).  
- Ownership evita exportar proyectos ajenos, pero no hay rate limit específico de export.  
- 50 páginas: posible en teoría (HTML multipágina + `page-break`), pero memoria/tiempo crecen linealmente; no hay límite explícito ni progreso streaming. Mejora futura: cola Bull/Redis + límite de páginas + Chromium compartido.

### ¿Cada cuánto se guarda? ¿Y si tengo el mismo proyecto abierto en dos pestañas?
Debounce **~800 ms** tras cada cambio. Indicador saving/saved/error.  
**Dos pestañas:** no hay sync ni locking; **el último PATCH gana** y puede pisar la otra. Undo es solo local a la pestaña. Mitigación futura: `updatedAt` / ETag / BroadcastChannel.

### ¿Por qué Zustand y no el estado de React o Redux?
El editor necesita un store **fuera del árbol**, con mutaciones frecuentes, historial past/future y serialización JSON. React Context re-renderiza de más; Redux es más ceremonia para el mismo patrón. Zustand es mínimo, tipado, y encaja con “el canvas solo pinta el store”.

### ¿Cómo evitas que un usuario vea o modifique los proyectos de otro?
1. Cookie JWT verificada (`requireAuth`).  
2. Toda mutación/lectura privada pasa por `getOwned(projectId, ownerId)` → 404 si no es dueño.  
3. Assets/export también filtran por `project.ownerId`.  
4. Lo público solo si `published && visibility==='public' && status==='active'`.  
El campo `role` existe, pero **no** hay bypass admin implementado en ownership.

### ¿Dónde guardas el token? ¿Cookie o localStorage? ¿Cómo caduca?
**Cookie httpOnly** `pliego_token` (no localStorage → menos XSS theft).  
`SameSite=Lax`, `Secure` en production.  
`JWT_EXPIRES_IN` default **7d**; `maxAge` de cookie alineado. Logout limpia cookie. Frontend usa `credentials: 'include'`.

### El texto del usuario acaba en un HTML que renderiza Chromium. ¿Te pueden inyectar algo?
Se escapan `& < > "` en textos, labels, títulos y attrs relevantes (`escapeHtml`). Los `href` se resuelven por whitelist de esquemas (`pliego:`, `http(s)`, `mailto`, paths, page ids). Riesgo residual: URLs `javascript:` no deberían pasar el resolver; imágenes usan `src` escapado pero el contenido binario ya pasó MIME whitelist. No es un sanitizer HTML completo tipo DOMPurify porque **no se inserta HTML libre del usuario**, solo texto → nodos.

### ¿Se puede adivinar el enlace público de un proyecto?
Slug = título slugificado + **6 chars base36 aleatorios** (~2.2e9). No es un secreto criptográfico, pero no es secuencial. Solo resoluble si además está publicado. Enumerar a ciegas es costoso; un título muy predecible + fuerza bruta del sufijo es el escenario teórico. Mejora: más entropía o UUIDs opacos.

### ¿Qué tipos de archivo se pueden subir?
Solo imágenes: **jpeg, png, webp, gif**. Máximo **5 MB**. Se guardan como `{projectId}/{uuid}{ext}` (el nombre del cliente no controla la ruta).

### ¿Cuántas pruebas tienes y qué cubren?
**11 tests Vitest** (verificado):
- Backend (9): auth/sesión/proyectos; `resolveInteractionHref` (next/prev/https/page/paths).  
- Frontend (2): documento vacío y z-index.  
CI en GitHub Actions. **No** hay E2E Playwright amplio ni tests a11y automatizados (roadmap).

### ¿Está desplegado? ¿Lo puedo abrir ahora?
Sí: **https://pliego-kr1j.onrender.com** (health OK en producción). Puede haber cold start en el plan free.

### ¿Lo han probado usuarios reales?
**No hay evidencia en el repositorio** (no analytics, no entrevistas versionadas, no issue tracker de usuarios). Para la defensa: di con honestidad si hiciste pruebas con compañeros/tutores y cuántas; no inventes N usuarios si no los documentaste.

### ¿Cumple WCAG? ¿Se puede usar el editor con teclado o lector de pantalla?
**No se reivindica conformidad WCAG AA.** Hay bases: `lang="es"`, `:focus-visible`, `aria-label`/`sr-only`/`role="alert"` en varias pantallas, `prefers-reduced-motion`. El editor Konva es **débil para teclado/lector** (canvas bitmap-like): la selección/transform es ratón/táctil. Landing/demo son más accesibles que el lienzo.

### ¿La identidad la has hecho tú? ¿Con qué herramientas?
En código la identidad está **sistematizada** (`pliegoBrand.ts`, CSS variables, SVGs en `frontend/public/brand`, tipografías Google Fonts, plantillas). Herramientas típicas del proyecto: Figma o equivalente para dirección de arte (si aplica en tu proceso), implementación en React/Tailwind, assets SVG.  
**Afirma solo lo que hayas diseñado tú**; el sistema de tokens y la coherencia sí están en el repo.

### ¿Tanto efecto visual (gradientes, cursor magnético) no molesta en una herramienta de trabajo?
Se separó **marketing/demo** (motion, mesh, beats) del **editor de trabajo** (chrome más quieto, posters de plantilla **estáticos** tras detectar flicker/epileptic motion). Además existe reduce-motion. Criterio de producto: la puerta de entrada vende presencia; el lienzo prioriza control. Si molesta, se puede apagar motion sin tocar el modelo de documento.

### ¿Por qué Space Grotesk y JetBrains Mono?
- **Space Grotesk:** grotesk geométrica contemporánea, legible en UI y titulares cortos; evita Inter/Roboto “AI default”.  
- **JetBrains Mono:** metadatos, eyebrows, índices tipográficos (VOL. 03, REPORTAJE) — contraste editorial display vs mono.  
Complemento: **Syne** (display brand), **DM Sans** (lectura), **Instrument Serif** (cita editorial).

### ¿Qué decisión de diseño cambió tu código?
Ejemplos reales del desarrollo:
1. Plantillas con motion infinito → **estáticas** + one-shot fit (parar jitter/epilepsia en móvil).  
2. PDF en Render sin `/usr/bin/chromium` → resolver runtime + **@sparticuz/chromium**.  
3. Documento como JSON propio (no serializar Konva) → undo/PDF/versión sobre el mismo contrato.  
4. Cookie httpOnly en lugar de Bearer en localStorage.  
5. Plantillas de 1 página → **3 actos** (portada/cuerpo/cierre) alineados a la narrativa PLIEGO.

### ¿Qué aporta Pliego frente a Canva?
| Canva | PLIEGO |
|---|---|
| Plantillas masivas, social-first | Editorial digital con dirección de arte propia |
| Abstrae el documento | JSON transparente, versiones, ownership |
| Export genérico | PDF con CTAs anotados + publicación `/p/:slug` con motion |
| Marca Canva | Marca estudio (tipografía + neón + demo cine) |
| Collab/enterprise | Slice TFM enfocado, auditable, self-hostable |

No compite en catálogo de assets; compite en **control editorial + publicación interactiva + narrativa de producto**.

### ¿Quién pagaría por esto? ¿Cómo lo sacarías adelante?
- Estudios boutique / marcas culturales / revistas digitales / education design.  
Modelo plausible: freemium (1–3 proyectos) + Pro (export PDF, custom domain, assets) + Education.  
Siguiente infra: Postgres + S3 + cola PDF + auth durable.  
Go-to-market: portfolio cases publicados con PLIEGO, partnerships con escuelas de diseño, open-core demo.

### ¿Hay pruebas E2E y evaluación con usuarios?
Sí. En `docs/evaluacion/` hay una batería **E2E por escenarios** con 4 personas (diseñadora, estudiante, móvil, editor de marca), capturas funcionales y el PDF `PLIEGO_E2E_EVALUACION.pdf` para anexar a la memoria. Se reproduce con `node scripts/persona-e2e-eval.mjs` y `node scripts/build-eval-pdf.mjs`. Es evaluación task-based reproducible sobre la app real; un estudio de laboratorio con N voluntarios sería el siguiente paso.

### ¿Las 400 horas son reales o estimadas?
**En el repositorio no hay registro de horas.** No digas “400” si no las has medido. Usa: diario de trabajo, commits, fases del README (1–8), y diferencia *estimación de planificación* vs *tiempo real*. Si tu memoria del máster pedía 400 h, aclara si es carga ECTS/estimada.

### ¿Qué ha sido lo más difícil?
Desde el código y la evolución reciente, los focos duros han sido:
1. **Editor móvil:** fit/zoom sin bucles de re-layout.  
2. **Fidelidad PDF + Chromium en PaaS free.**  
3. **Mantener identidad fuerte sin romper usabilidad del editor.**  
4. **Contrato JSON único** para canvas, versiones y export.

### Si empezaras de nuevo, ¿qué harías distinto?
- Postgres + storage S3 desde el día 1 del deploy.  
- Cola de exportación y límites.  
- Migraciones de `document.version` desde el primer cambio de schema.  
- Más cobertura E2E en CI (ya hay batería por personas en `docs/evaluacion/` + `scripts/persona-e2e-eval.mjs`).  
- Conflictos multi-pestaña mínimos (`updatedAt`).  
- A11y del editor (lista de capas teclado-first) en paralelo al canvas.

### ¿Qué has usado de lo aprendido en el máster?
Conecta explícitamente (ajusta a tus asignaturas reales):
- Ingeniería web full stack (API REST, auth, cookies)  
- Modelado de datos / Prisma / tradeoff SQL vs documento  
- UX/UI y dirección de arte digital  
- Arquitectura front (estado, componentes, rendimiento canvas)  
- DevOps ligero (Docker, CI, PaaS)  
- Metodología de proyecto (fases, roadmap, documentación)

---

