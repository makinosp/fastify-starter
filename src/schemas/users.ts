import { z } from 'zod';

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const UserListSchema = z.array(UserSchema);

export const CreateUserSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  email: z.email().optional(),
  name: z.string().optional(),
});

export const UserIdParamsSchema = z.object({
  id: z.uuid(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export const NoContentSchema = z.null().describe('No Content');
