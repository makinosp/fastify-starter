import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { ErrorResponseSchema, UpdateUserSchema, UserIdParamsSchema, UserSchema } from '@/schemas/users';

const plugin: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    '',
    {
      schema: {
        description: 'Update a user by id',
        tags: ['users'],
        params: UserIdParamsSchema,
        body: UpdateUserSchema,
        response: {
          200: UserSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const user = await fastify.db.user.update({
          where: { id },
          data: request.body,
        });
        return reply.send(user);
      } catch (error) {
        return reply.code(404).send({ error: 'User not found' });
      }
    },
  );
};

export default plugin;
