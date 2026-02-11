import type { FastifyZodInstance } from 'fastify';
import { ErrorResponseSchema, UpdateUserSchema, UserIdParamsSchema, UserSchema } from '@/schemas/users';

const schema = {
  description: 'Update a user by id',
  tags: ['users'],
  params: UserIdParamsSchema,
  body: UpdateUserSchema,
  response: {
    200: UserSchema,
    404: ErrorResponseSchema,
  },
} as const;

export default (fastify: FastifyZodInstance): FastifyZodInstance =>
  fastify.put('', { schema }, async (request, reply) => {
    const { id } = request.params;
    try {
      const user = await fastify.db.user.update({
        where: { id },
        data: request.body,
      });
      return await reply.send(user);
    } catch {
      return reply.code(404).send({ error: 'User not found' });
    }
  });
