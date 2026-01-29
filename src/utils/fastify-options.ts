import { join } from 'path';
import { randomUUID } from 'crypto';
import type { FastifyServerOptions } from 'fastify';
import type { AutoloadPluginOptions } from '@fastify/autoload';
import type pino from 'pino';
import qs from 'qs';
import { nodeEnvs, type Env } from './env.js';

/**
 * Options for autoloading plugins and routes
 */
type AutoLoadOptions = { baseDirPath: string } & Pick<AutoloadPluginOptions, 'ignoreFilter'>;

/**
 * Custom querystring parser using qs library
 * Supports nested objects, arrays with bracket notation, and complex query structures
 * Compatible with Zod validation for structured query parameters
 */
export const querystringParser = (str: string): Record<string, unknown> =>
  qs.parse(str, { allowDots: true, parseArrays: true });

export const generateFastifyOptions = (env: Env['NODE_ENV']): FastifyServerOptions => {
  const logger: pino.LoggerOptions = { level: 'info' };
  if (env === 'development') {
    logger.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    };
  } else if (env === nodeEnvs.test) {
    logger.level = 'silent';
  }
  const genReqId: FastifyServerOptions['genReqId'] = () => randomUUID();
  return { logger, genReqId, routerOptions: { querystringParser } };
};

/**
 * Creates Fastify autoload plugin options
 * @param options - Configuration options for plugin autoloading
 * @param options.baseDirPath - Base directory path for locating the plugins directory
 * @param options.ignoreFilter - Optional regex pattern to exclude files from loading
 * @returns AutoloadPluginOptions configured to load .plugin.ts and .plugin.js files
 * @example
 * const pluginOptions = createAutoloadPluginOptions({
 *   baseDirPath: srcDir,
 *   ignoreFilter: /experimental/
 * });
 */
export const createAutoloadPluginOptions = (options: AutoLoadOptions): AutoloadPluginOptions => {
  const { baseDirPath, ignoreFilter } = options;
  return {
    dir: join(baseDirPath, 'plugins'),
    ignoreFilter,
    matchFilter: /\.plugin\.(?:ts|js)$/,
  };
};

/**
 * Creates Fastify autoload route options with hook support
 * @param options - Configuration options for route autoloading
 * @param options.baseDirPath - Base directory path for locating the routes directory
 * @param options.ignoreFilter - Optional regex pattern to exclude files from loading
 * @returns AutoloadPluginOptions configured to load HTTP method files (get.ts, post.ts, etc.)
 *         with directory-based routing, automatic hook discovery, and cascading hooks
 * @example
 * const routeOptions = createAutoloadRouteOptions({
 *   baseDirPath: srcDir,
 *   ignoreFilter: /admin|internal/
 * });
 */
export const createAutoloadRouteOptions = (options: AutoLoadOptions): AutoloadPluginOptions => {
  const { baseDirPath, ignoreFilter } = options;
  return {
    dir: join(baseDirPath, 'routes'),
    ignoreFilter,
    matchFilter: /(?:^|\/)(?:get|post|put|patch|delete)\.(?:ts|js)$/,
    routeParams: true,
    dirNameRoutePrefix: true,
    autoHooks: true,
    cascadeHooks: true,
    overwriteHooks: true,
    autoHooksPattern: /hook/,
  };
};
