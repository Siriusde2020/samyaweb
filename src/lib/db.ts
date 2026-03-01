import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient();
  } catch {
    // During build time or when DATABASE_URL is not set, return a proxy
    // that throws meaningful errors only when actually used
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') return undefined;
        throw new Error(
          `Database not available. Set DATABASE_URL environment variable. Attempted to access prisma.${String(prop)}`
        );
      },
    });
  }
}

// Lazy initialization - only create PrismaClient when first accessed
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    const client = globalForPrisma.prisma;
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
