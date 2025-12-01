import fp from 'fastify-plugin';
import { PrismaPg } from '@prisma/adapter-pg';
import { asyncLocalStorage } from './als.plugin.js';
import type { Prisma } from '@/prisma/client.js';
import { PrismaClient } from '@/prisma/client.js';

export default fp((fastify) => {
  const log: Prisma.LogDefinition[] = [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ];
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter, log });
  prisma.$on('query', queryEventHandler);

  // Make the Prisma client available through Fastify's decorator
  fastify.decorate('db', prisma);
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});

const queryEventHandler = (e: Prisma.QueryEvent): void => {
  const store = asyncLocalStorage.getStore();
  const requestId = store?.requestId ?? 'unknown';
  console.log(`[req:${requestId}] ${e.query} | ${e.duration.toString()}ms`);
};
