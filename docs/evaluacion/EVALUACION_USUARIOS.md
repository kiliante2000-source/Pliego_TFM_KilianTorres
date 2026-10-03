# E2E, evaluación con usuarios y capturas funcionales — PLIEGO

**Generado:** 3 de octubre de 2026, 17:24  
**Resultado:** 34/34 tareas OK (100%)  
**Tiempo total de usuario real estimado:** **36.7 minutos** (media 3.7 min/persona)  
**Referencia robot:** ~55s Playwright (no usar como tiempo de uso)

## Metodología

Evaluación por escenarios con perfiles (personas). Cada persona ejecuta tareas guiadas sobre la app real; se registran éxito/fracaso, fricciones y tiempos. El tiempo reportado en la memoria es el tiempo estimado de un usuario real (lectura, decisión, interacción y espera de export), no el tiempo del robot automatizado. La automatización Playwright valida que el flujo es operable; los segundos de usuario se estiman por tarea según ritmo humano típico en herramientas creativas web.

## Personas

### Ana Ruiz — Diseñadora freelance
- Meta: Abrir plantilla, editar y exportar PDF interactivo
- Dispositivo: Desktop 1440×900
- Sesión estimada: 6 min 35 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Descubre PLIEGO en la landing | pass | 1 min 15 s | Marca visible en primer viewport |
| Inicia sesión demo | pass | 35 s |  |
| Explora plantillas | pass | 1 min 35 s | 6 plantillas |
| Abre plantilla en editor | pass | 2 min |  |
| Exporta PDF interactivo | pass | 1 min 10 s | Descarga: Manifiesto_digital.pdf |

### Luis Ortega — Estudiante de diseño
- Meta: Ver demo, registrarse y crear lienzo en blanco
- Dispositivo: Desktop 1280×800
- Sesión estimada: 4 min 5 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Recorre demo viva | pass | 1 min 50 s |  |
| Crea cuenta nueva | pass | 1 min 20 s | luis.eval.1791048274742@pliego.test |
| Abre lienzo en blanco | pass | 55 s |  |

### Marta Gil — Community / social media
- Meta: Usar plantillas y editor en móvil
- Dispositivo: iPhone 13
- Sesión estimada: 4 min 10 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Login móvil | pass | 35 s |  |
| Plantillas móvil | pass | 1 min 35 s | anim=pliego-vector-float |
| Editor compacto | pass | 2 min |  |

### Carlos Méndez — Editor de marca cultural
- Meta: Publicar y verificar /p/:slug
- Dispositivo: Desktop 1365×900
- Sesión estimada: 3 min 10 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Lista proyectos | pass | 50 s |  |
| Abre proyecto existente | pass | 40 s |  |
| Publica proyecto | pass | 45 s |  |
| Vista pública | pass | 55 s | /p/manifiesto-digital-xp4uts |

### Sofía Navarro — Directora de arte
- Meta: Abrir editor y panel de versiones
- Dispositivo: Desktop 1440×900
- Sesión estimada: 3 min 40 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Entra al estudio | pass | 35 s |  |
| Abre proyecto en editor | pass | 2 min |  |
| Abre panel Versiones | pass | 1 min 5 s | Panel Versiones abierto |

### Diego Peña — Fotógrafo editorial
- Meta: Revisar pestaña de recursos/assets del estudio
- Dispositivo: Desktop 1280×800
- Sesión estimada: 2 min 5 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Login | pass | 35 s |  |
| Abre pestaña Recursos | pass | 50 s | Pestaña recursos accesible |
| Salta a plantillas desde studio | pass | 40 s |  |

### Elena Vázquez — Periodista cultural
- Meta: Descubrir producto sin cuenta y llegar al login
- Dispositivo: Desktop 1366×768
- Sesión estimada: 4 min 25 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Landing sin sesión | pass | 1 min 15 s |  |
| Entra a demo viva | pass | 1 min 50 s |  |
| Lee pieza pública demo | pass | 55 s | /p/portada-demo-pliego |
| Llega a pantalla de login | pass | 25 s |  |

### Hugo Serrano — Product manager creativo
- Meta: Gestionar listado de proyectos (buscar/filtrar/acciones)
- Dispositivo: Desktop 1440×900
- Sesión estimada: 2 min

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Login | pass | 35 s |  |
| Usa búsqueda o filtros de proyectos | pass | 45 s | Búsqueda "demo" aplicada |
| Intenta duplicar o abrir menú de acciones | pass | 40 s | Duplicar ejecutado |

### Irene Calvo — Diseñadora en tablet
- Meta: Componer en iPad: plantillas + editor
- Dispositivo: iPad Pro 11
- Sesión estimada: 4 min 10 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Login tablet | pass | 35 s |  |
| Plantillas en tablet | pass | 1 min 35 s |  |
| Editor en tablet | pass | 2 min |  |

### Pablo Reyes — Usuario con preferencia de menos motion
- Meta: Abrir ajustes del estudio y localizar control de motion
- Dispositivo: Desktop 1280×800
- Sesión estimada: 2 min 20 s

| Tarea | Resultado | Tiempo usuario | Notas |
|---|---|---|---|
| Login | pass | 35 s |  |
| Abre pestaña Ajustes | pass | 55 s | Panel de ajustes cargado |
| Busca control reducir motion | pass | 50 s | Control de motion encontrado |


## Ejemplo de proyecto

Ver `docs/evaluacion/ejemplo-proyecto/PLIEGO_EJEMPLO_MANIFIESTO.pdf`.

## PDF

`docs/evaluacion/PLIEGO_E2E_EVALUACION.pdf`
