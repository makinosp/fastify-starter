import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CreateUserSchema, UserSchema } from '@/schemas/users';

const plugin: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    '',
    {
      schema: {
        description: 'Create a new user',
        tags: ['users'],
        body: CreateUserSchema,
        response: {
          201: UserSchema,
        },
      },
    },
    async (request, reply) => {
      const user = await fastify.db.user.create({
        data: request.body,
      });
      return reply.code(201).send(user);
    },
  );
};

export default plugin;
