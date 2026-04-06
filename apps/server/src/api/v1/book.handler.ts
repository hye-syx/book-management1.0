import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { books } from '@repo/db/schema/book-schema';
import { bookSchema } from '@repo/types/book.type';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { updateBookSchema } from '@repo/types/update.type';
import { addBookSchema } from '@repo/types/addBook.type';

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
      id: z.coerce.number(),
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
//根据id查询图书
export const getBookByIdRoute = createRoute({
  method: 'get',
  path: '/books/{id}',
  request: {
    params: z.object({
      id: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: bookSchema,
        },
      },
      description: '获取图书',
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
//编辑图书
export const editBookRoute = createRoute({
  method: 'put',
  path: '/books/{id}',
  request: {
    params: z.object({
      id: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateBookSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: bookSchema,
        },
      },
      description: '编辑图书',
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
// 新增单本图书
export const createBookRoute = createRoute({
  method: 'post',
  path: '/books',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            isbn: z.string(),
            title: z.string(),
            author: z.string(),
            publisher: z.string(),
            publicationDate: z.number(),
            categoryId: z.string(),
            price: z.number(),
            total: z.number(),
          }),
        },
      },
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: bookSchema,
        },
      },
      description: '创建图书成功',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: '未登录',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: '参数错误',
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

    const { id } = c.req.valid('param');
    await db.delete(books).where(eq(books.id, id));
    return c.json({ message: '删除成功' }, 200);
  })
  .openapi(editBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      return c.json({ message: '未登录' }, 401);
    }

    const { id } = c.req.valid('param');
    const body = await c.req.json();
    const book = updateBookSchema.parse(body);

    const [updated] = await db
      .update(books)
      .set({ ...book, updatedAt: dayjs().unix() })
      .where(eq(books.id, id))
      .returning();
    return c.json(updated, 200);
  })
  .openapi(getBookByIdRoute, async (c) => {
    const { id } = c.req.valid('param');
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return c.json(book, 200);
  })
  .openapi(createBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      return c.json({ message: '未登录' }, 401);
    }

    const body = await c.req.json();
    const book = addBookSchema.parse(body);
    const total = book.total;
    const available = total;
    const isbn = book.isbn;
    if (!(total > 0)) {
      return c.json({ message: '库存数量不能为负数或0' }, 400);
    }
    if (isbn) {
      const [existing] = await db.select().from(books).where(eq(books.isbn, isbn));
      if (existing) {
        return c.json({ message: 'ISBN已存在' }, 400);
      }
    }
    const [created] = await db.insert(books).values({ ...book, createdAt: dayjs().unix(), updatedAt: dayjs().unix(), available }).returning();
    return c.json(created, 200);
  });
  

export type BookAppType = typeof bookApp;
