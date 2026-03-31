import { createRoute, z } from '@hono/zod-openapi';
import { bookSchema } from '@repo/db/types/book.type';
import { db } from '@repo/db';
import { books } from '@repo/db/schema/book-schema';
import { Context } from 'hono';

//获取全部图书
const listBookRoute = createRoute({
  method: 'get',
  path: '/books',
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
 const listBookHandler = async (c: Context) => {
  const listBook = await db.select().from(books);
  return c.json(listBook, 200);
};
export { listBookRoute, listBookHandler };
