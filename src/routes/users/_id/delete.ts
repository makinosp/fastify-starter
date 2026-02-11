import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { ErrorResponseSchema, NoContentSchema, UserIdParamsSchema } from '@/schemas/users';

const plugin: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    '',
    {
      schema: {
        description: 'Delete a user by id',
        tags: ['users'],
        params: UserIdParamsSchema,
        response: {
          204: NoContentSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        await fastify.db.user.delete({
          where: { id },
        });
        return reply.code(204).send();
      } catch (error) {
        return reply.code(404).send({ error: 'User not found' });
      }
    },
  );
};

export default plugin;
