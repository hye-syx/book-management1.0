import { OpenAPIHono } from '@hono/zod-openapi';
import { auth } from './lib/auth';
import { cors } from 'hono/cors';
// import { route, handler } from './api/v1/get-allbooks';

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

// app.openapi(route, handler);

export default {
  port: 3001,
  fetch: app.fetch,
};
