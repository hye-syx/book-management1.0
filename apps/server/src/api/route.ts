import { OpenAPIHono } from '@hono/zod-openapi';
import { applicationApp } from './v1/application.handler';
import { bookApp } from './v1/book.handler';
import { userApp } from './v1/user.handler';

export const apiRoutes = new OpenAPIHono()
.route('/',bookApp)
.route('/',applicationApp)
.route('/',userApp);
export function initRoutes(app: OpenAPIHono) {
  // 注册路由
  app.route('/api/v1', apiRoutes);
}

export type AppType = typeof apiRoutes;
// export type ApplicationAppType = typeof applicationApp;
// export type AppType = BookType & ApplicationAppType;
