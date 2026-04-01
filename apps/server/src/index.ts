import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { initRoutes } from './api/route';
import { auth } from './lib/auth';

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

///获取全部图书
// app.openapi(listBookRoute, listBookHandler);

initRoutes(app);

export default {
  port: 3001,
  fetch: app.fetch,
};
