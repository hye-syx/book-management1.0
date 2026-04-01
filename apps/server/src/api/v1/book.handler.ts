import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { books } from '@repo/db/schema/book-schema';
import { bookSchema } from '@repo/db/types/book.type';

import { eq } from 'drizzle-orm';

import { getSession } from '../../lib/get-session';

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
// 删除图书
export const deleteBookRoute = createRoute({
  method: 'delete',
  path: '/books/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: '删除图书',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: '未登录',
    },
  },
});

export const bookApp = app
  .openapi(listBookRoute, async (c) => {
    const listBook = await db.select().from(books);
    return c.json(listBook, 200);
  })
  .openapi(deleteBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      return c.json({ message: '未登录' }, 401);
    }

    const { id } = c.req.param();
    await db.delete(books).where(eq(books.id, id));
    return c.json({ message: '删除成功' }, 200);
  });

export type BookAppType = typeof bookApp;
