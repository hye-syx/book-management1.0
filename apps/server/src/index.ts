import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { handle } from 'hono-alibaba-cloud-fc3-adapter';
import { initRoutes } from './api/route';
import { startOverdueRecordsScheduler } from './jobs/overdue-records.job';
import { auth } from './lib/auth';

function createApp() {
  const app = new OpenAPIHono();

  app.use(
    cors({
      origin: ['http://localhost:3000'],
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
