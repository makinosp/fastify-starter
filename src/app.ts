import path from 'path';
import { fileURLToPath } from 'url';
import autoLoad from '@fastify/autoload';
import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createAutoloadPluginOptions, createAutoloadRouteOptions, generateFastifyOptions } from './utils/fastify-options.js';
import { env, nodeEnvs } from './utils/env.js';

const start = async (): Promise<void> => {
  const baseDirPath = path.dirname(fileURLToPath(import.meta.url));
  const fastifyOptions = generateFastifyOptions(env.NODE_ENV);
  const server = Fastify(fastifyOptions).withTypeProvider<ZodTypeProvider>();
  // In production, ignore loading swagger-related plugins
  const ignoreFilter: RegExp | undefined = env.NODE_ENV === nodeEnvs.production ? /swagger/ : undefined;
  try {
    server.register(autoLoad, createAutoloadPluginOptions({ baseDirPath, ignoreFilter }));
    server.register(autoLoad, createAutoloadRouteOptions({ baseDirPath }));
    await server.ready();
    await server.listen({ host: '0.0.0.0', port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (env.NODE_ENV !== nodeEnvs.test) {
  await start();
}
