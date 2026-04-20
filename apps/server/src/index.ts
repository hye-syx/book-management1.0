import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { handle } from 'hono-alibaba-cloud-fc3-adapter';
import { initRoutes } from './api/route';
import { startOverdueRecordsScheduler } from './jobs/overdue-records.job';
import { auth } from './lib/auth';

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

function createApp() {
  const app = new OpenAPIHono();

  if (!FRONTEND_ORIGIN) {
    throw new Error('FRONTEND_ORIGIN 环境变量未设置');
  }

  app.use(
    cors({
      origin: [FRONTEND_ORIGIN],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
      credentials: true,
    }),
  );

  app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({ message: err.message }, err.status);
    }

    console.error(err);
    return c.json({ message: '服务器内部错误' }, 500);
  });

  ///获取全部图书
  // app.openapi(listBookRoute, listBookHandler);

  initRoutes(app);
  startOverdueRecordsScheduler();

  return app;
}

export const handler = handle(createApp());

export default {
  port: 3001,
  fetch: createApp().fetch,
};
