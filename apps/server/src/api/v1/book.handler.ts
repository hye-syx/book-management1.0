import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { books } from '@repo/db/schema/book-schema';
import { bookSchema } from '@repo/db/types/book.type';
import { hc } from 'hono/client';

const app = new OpenAPIHono();
//获取全部图书
export const listBookRoute = createRoute({
  method: 'get',
  path: '/books',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(bookSchema),
        },
      },
      description: '获取全部图书',
    },
  },
});

const route = app.openapi(listBookRoute, async (c) => {
  const listBook = await db.select().from(books);
  return c.json(listBook, 200);
});

export default app;
export type ListBookRouteType = typeof route;