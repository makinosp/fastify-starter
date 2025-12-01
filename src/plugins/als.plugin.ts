import { AsyncLocalStorage } from 'async_hooks';
import fp from 'fastify-plugin';

interface Context { requestId: string }

export const asyncLocalStorage = new AsyncLocalStorage<Context>();

export default fp((fastify) => {
  fastify.addHook('onRequest', (request, _, done) => {
    asyncLocalStorage.run({ requestId: request.id }, () => {
      done();
    });
  });
});
