# Base de datos

## Desarrollo (actual)

Prisma usa **SQLite** (`file:./dev.db`) para fricción cero en desarrollo local y demos.

## Producción MySQL

1. En `backend/prisma/schema.prisma` cambia:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

2. Define:

```
DATABASE_URL="mysql://USER:PASS@HOST:3306/pliego"
```

3. Regenera y migra:

```bash
npx prisma migrate dev --name mysql_init
```

El modelo de datos (Users, Projects, ProjectVersions, Assets, Exports) es idéntico.
