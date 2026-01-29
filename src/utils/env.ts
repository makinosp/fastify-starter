import fs from 'fs';
import { z, ZodError } from 'zod';
import type { DotenvConfigOutput } from 'dotenv';
import { config } from 'dotenv';

export type Env = z.infer<typeof envSchema>;

export const nodeEnvs = {
  development: 'development',
  production: 'production',
  test: 'test',
} as const satisfies Record<string, string>;

export const envSchema = z.object({
  SQLITE_FILENAME: z.string().min(1, 'SQLITE_FILENAME is required'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  NODE_ENV: z.enum(nodeEnvs).default(nodeEnvs.development),
});

const loadEnvFile = (): DotenvConfigOutput | undefined => {
  const path = process.env.ENV_PATH ?? '.env';
  if (fs.existsSync(path)) {
    return config({ path });
  }
};

export const getEnv = (): Env => {
  try {
    loadEnvFile();
    const env = envSchema.parse(process.env);

    const DATABASE_URL = 'file:./dev.db';
    return { ...env, DATABASE_URL } as Env & { DATABASE_URL: string };
  } catch (error) {
    const messages: string[] = ['Environment variable validation error:'];
    if (error instanceof ZodError) {
      error.issues.forEach((err) => {
        messages.push(`  - ${err.message} at ${err.path.join('.')}`);
      });
    } else if (error instanceof Error) {
      messages.push(`  - ${error.message}`);
    } else {
      messages.push('  - An unknown error occurred during environment validation.');
    }
    throw new Error(messages.join('\n'), { cause: error });
  }
};

export const env = getEnv();
