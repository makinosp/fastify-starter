import type { FastifyZodInstance } from 'fastify';
import { UserListSchema } from '@/schemas/users';

const schema = {
  description: 'Retrieve user list',
  tags: ['users'],
  response: {
    200: UserListSchema,
  },
} as const;

export default (fastify: FastifyZodInstance): FastifyZodInstance =>
  fastify.get('', { schema },
    async (_request, reply) => {
      const users = await fastify.db.user.findMany({ orderBy: { createdAt: 'desc' } });
      return reply.send(users);
    },
  );
