import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UserListSchema } from '@/schemas/users';

const plugin: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '',
    {
      schema: {
        description: 'Retrieve user list',
        tags: ['users'],
        response: {
          200: UserListSchema,
        },
      },
    },
    async (_request, reply) => {
      const users = await fastify.db.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return reply.send(users);
    },
  );
};

export default plugin;
