import {
  bodyMiddleWare,
  responseMiddleWare,
  sessionMiddleWare,
  startServer,
  staticMiddleWare,
  authMiddleWare,
} from 'wittyna';
import { PrismaClient } from '@prisma/client';
import * as controllers from './controllers/index.mjs';
import { CONFIG } from './config.mjs';
import { init } from './init.mjs';

export const prismaClient = new PrismaClient();
await init();

startServer({
  port: CONFIG.port,
  controllers: Object.values(controllers),
  routerPrefix: '/admin',
  middlewares: [
    staticMiddleWare({
      root: CONFIG.uiRoot,
      pathPrefix: '',
      ignorePathPrefix: '/admin',
    }),
    sessionMiddleWare({
      redisOptions: {
        host: CONFIG.redis.host,
        port: CONFIG.redis.port,
        db: CONFIG.redis.db,
      },
      sessionOptions: {
        key: 'admin:sid',
        ttl: CONFIG.sessionLeftTime ? CONFIG.sessionLeftTime * 1000 : undefined,
      },
    }),
    authMiddleWare({
      clientId: CONFIG.clients[0].id,
      clientSecret: CONFIG.clients[0].secret,
      apiPrefix: `${CONFIG.iss}/admin`,
      uiUrl: CONFIG.iss,
      authServerOrigin: CONFIG.authIss,
    }),
    responseMiddleWare(),
    bodyMiddleWare(),
  ],
  options: {
    iss: CONFIG.iss,
  },
});
