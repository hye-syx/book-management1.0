import type { OpenAPIHono } from '@hono/zod-openapi';
import { bookApp } from './v1/book.handler';

export function initRoutes(app: OpenAPIHono) {
  // 注册路由
  app.route('/api/v1', bookApp);
}

export type AppType = typeof bookApp;
