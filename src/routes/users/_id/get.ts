import type { FastifyZodInstance } from 'fastify';
import { ErrorResponseSchema, UserIdParamsSchema, UserSchema } from '@/schemas/users';

const schema = {
  description: 'Retrieve a user by id',
  tags: ['users'],
  params: UserIdParamsSchema,
  response: {
    200: UserSchema,
    404: ErrorResponseSchema,
  },
} as const;

export default (fastify: FastifyZodInstance): FastifyZodInstance =>
  fastify.get('', { schema }, async (request, reply) => {
    const { id } = request.params;
    const user = await fastify.db.user.findUnique({ where: { id } });
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    return reply.send(user);
  });
