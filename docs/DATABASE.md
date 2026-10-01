# Base de datos

## Desarrollo (actual)

Prisma usa **SQLite** (`file:./dev.db`) con:

- **WAL** (`journal_mode=WAL`) para lecturas/escrituras concurrentes
- `busy_timeout` y `foreign_keys=ON`
- Índices en `User(status, createdAt, lastLoginAt)` y
  `Project(ownerId+status, ownerId+updatedAt, published+visibility)`

Campos de cuenta listos para escala: `status`, `lastLoginAt`, `loginCount`.

## Registro y auth

- Email normalizado (lowercase) + unique constraint (carrera segura con `P2002`)
- Contraseña: mínimo 8 caracteres, letra + número; confirmación opcional
- Rate limit separado: registro estricto / login más permisivo
- Cuentas `suspended` / `deleted` bloqueadas en login
- Health check `/api/health` verifica la base (`db: "up"|"down"`)

## Listado de proyectos

`GET /api/projects` soporta paginación:

- `take` (1–500, default 200)
- `skip`
- `q` (busca en título/slug)
- `status`

Respuesta: `{ projects, total, take, skip }`.

## Producción (PostgreSQL recomendado)

1. En `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Define:

```
DATABASE_URL="postgresql://USER:PASS@HOST:5432/pliego"
```

3. Regenera y migra:

```bash
npx prisma migrate dev --name postgres_init
```

El modelo (Users, Projects, ProjectVersions, Assets, Exports) es el mismo.
MySQL también es viable cambiando `provider` a `"mysql"`.
