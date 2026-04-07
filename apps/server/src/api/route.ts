import type { OpenAPIHono } from '@hono/zod-openapi';
import { applicationApp } from './v1/application.handler';
import { bookApp } from './v1/book.handler';

export function initRoutes(app: OpenAPIHono) {
  // 注册路由
  app.route('/api/v1', bookApp);
  app.route('/api/v1', applicationApp);
}

export type BookType = typeof bookApp;
export type ApplicationAppType = typeof applicationApp;
export type AppType = BookType & ApplicationAppType;
