import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaReady?: Promise<void>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/** Enable SQLite WAL + busy timeout for concurrent readers/writers. */
export async function prepareDatabase() {
  if (globalForPrisma.prismaReady) {
    await globalForPrisma.prismaReady;
    return;
  }

  globalForPrisma.prismaReady = (async () => {
    try {
      await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
      await prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;');
      await prisma.$queryRawUnsafe('PRAGMA busy_timeout = 5000;');
      await prisma.$queryRawUnsafe('PRAGMA foreign_keys = ON;');
    } catch {
      // Non-SQLite providers (e.g. Postgres) ignore these PRAGMAs.
    }
  })();

  await globalForPrisma.prismaReady;
}

export async function pingDatabase() {
  await prisma.$queryRawUnsafe('SELECT 1');
}
