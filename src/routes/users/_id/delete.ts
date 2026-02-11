import type { FastifyZodInstance } from 'fastify';
import { ErrorResponseSchema, NoContentSchema, UserIdParamsSchema } from '@/schemas/users';

const schema = {
  description: 'Delete a user by id',
  tags: ['users'],
  params: UserIdParamsSchema,
  response: {
    204: NoContentSchema,
    404: ErrorResponseSchema,
  },
} as const;

export default (fastify: FastifyZodInstance): FastifyZodInstance =>
  fastify.delete('', { schema }, async (request, reply) => {
    const { id } = request.params;
    try {
      await fastify.db.user.delete({ where: { id } });
      return await reply.code(204).send();
    } catch {
      return reply.code(404).send({ error: 'User not found' });
    }
  });
