import type { FastifyZodInstance } from 'fastify';
import { CreateUserSchema, UserSchema } from '@/schemas/users';

const schema = {
  description: 'Create a new user',
  tags: ['users'],
  body: CreateUserSchema,
  response: {
    201: UserSchema,
  },
} as const;

export default (fastify: FastifyZodInstance): FastifyZodInstance =>
  fastify.post('', { schema },
    async (request, reply) => {
      const user = await fastify.db.user.create({
        data: request.body,
      });
      return reply.code(201).send(user);
    },
  );
