import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { bookCategory, books } from '@repo/db/schema/book-schema';
import { addBookSchema, batchAddBookResultSchema, batchAddBookSchema } from '@repo/types/src/book/addBook.type';
import { bookSchema } from '@repo/types/src/book/book.type';
import { categorySchema } from '@repo/types/src/book/category.type';
import { updateBookSchema } from '@repo/types/src/book/update.type';
import dayjs from 'dayjs';
import { asc, eq, ilike, or } from 'drizzle-orm';

import {
  badRequest,
  errorSchema,
  forbidden,
  unauthorized,
} from '../../lib/api-error';
import { getSession } from '../../lib/get-session';

const app = new OpenAPIHono();
//获取全部图书
export const listBookRoute = createRoute({
  method: 'get',
  path: '/books',
  request: {
    query: z.object({
      keyword: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(
            bookSchema.extend({
              categoryName: z.string(),
            }),
          ),
        },
      },
      description: '获取全部图书',
    },
    401: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '未登录',
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
          schema: errorSchema,
        },
      },
      description: '未登录',
    },
    403: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '没有权限',
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
          schema: bookSchema.extend({
            categoryName: z.string(),
          }),
        },
      },
      description: '获取图书',
    },
    401: {
      content: {
        'application/json': {
          schema: errorSchema,
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
          schema: errorSchema,
        },
      },
      description: '未登录',
    },
    403: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '没有权限',
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
          schema: addBookSchema,
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
      description: '创建图书成功',
    },
    401: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '未登录',
    },
    400: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '参数错误',
    },
    403: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '没有权限',
    },
  },
});
// 批量导入图书
export const batchCreateBookRoute = createRoute({
  method: 'post',
  path: '/books/batch',
  request: {
    body: {
      content: {
        'application/json': {
          schema: batchAddBookSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: batchAddBookResultSchema,
        },
      },
      description: '批量导入图书成功',
    },
    401: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '未登录',
    },
    400: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '参数错误',
    },
    403: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '没有权限',
    },
  },
});


// 查询所有分类信息
export const listCategoryRoute = createRoute({
  method: 'get',
  path: '/categories',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(categorySchema),
        },
      },
      description: '获取全部分类',
    },
    401: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '未登录',
    },
  },
});
export const bookApp = app
  .openapi(listBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    const {keyword} = c.req.valid('query');
    const search = keyword?.trim();
    const listBook = await db
      .select()
      .from(books)
      .leftJoin(bookCategory, eq(books.categoryId, bookCategory.id))
      .where(
        search
          ? or(
              ilike(books.title, `%${search}%`),
              ilike(books.author, `%${search}%`),
              ilike(books.isbn, `%${search}%`),
            )
          : undefined,
      )
      .orderBy(asc(books.createdAt));
    return c.json(listBook, 200);
  })
  .openapi(deleteBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role === 'reader') {
      throw forbidden();
    }

    const { id } = c.req.valid('param');
    await db.delete(books).where(eq(books.id, id));
    return c.json({ message: '删除成功' }, 200);
  })
  .openapi(editBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role === 'reader') {
      throw forbidden();
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
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    const { id } = c.req.valid('param');
    const [book] = await db
      .select()
      .from(books)
      .leftJoin(bookCategory, eq(books.categoryId, bookCategory.id))
      .where(eq(books.id, id));
    const result = {
      ...book.books,
      categoryName: book.book_category?.name || '',
    };
    return c.json(result, 200);
  })
  .openapi(createBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role === 'reader') {
      throw forbidden();
    }
    const body = await c.req.json();
    const book = addBookSchema.parse(body);
    const total = book.total;
    const available = total;
    const isbn = book.isbn;
    if (!(total > 0)) {
      throw badRequest('库存数量不能为负数或0');
    }
    if (isbn) {
      const [existing] = await db
        .select()
        .from(books)
        .where(eq(books.isbn, isbn));
      if (existing) {
        throw badRequest('ISBN已存在');
      }
    }
    const [created] = await db
      .insert(books)
      .values({
        ...book,
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        available,
      })
      .returning();
    return c.json(created, 200);
  })
  .openapi(listCategoryRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    const categories = await db.select().from(bookCategory);
    return c.json(categories, 200);
  })
  .openapi(batchCreateBookRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role === 'reader') {
      throw forbidden();
    }
    const body = await c.req.json();
    const { items } = batchAddBookSchema.parse(body);
    if (items.length === 0) {
      throw badRequest('至少导入一条图书数据');
    }

    const usedIsbns: string[] = [];
    const failures: { row: number; reason: string }[] = [];
    const validItems: typeof items = [];
    items.forEach((item, index) => {
      const isbn = item.isbn.trim();
      const row = index + 2;
      if (usedIsbns.includes(isbn)) {
        failures.push({
          row,
          reason: 'ISBN重复',
        });
        return;
      }
      if (item.total <= 0) {
        failures.push({
          row,
          reason: '库存数量不能为负数或0',
        });
        return;
      }

      usedIsbns.push(isbn);
      validItems.push({
        ...item,
        isbn,
      });
    });

    const finalItems: typeof validItems = [];
    for (const item of validItems) {
      const existingBooks = await db
        .select()
        .from(books)
        .where(eq(books.isbn, item.isbn));

      if (existingBooks.length > 0) {
        const row =
          items.findIndex((book) => book.isbn.trim() === item.isbn) + 2;

        failures.push({
          row,
          reason: 'ISBN已存在',
        });
        continue;
      }

      finalItems.push(item);
    }

    if (finalItems.length === 0) {
      return c.json(
        {
          successCount: 0,
          failureCount: failures.length,
          failures,
        },
        200,
      );
    }

    const values = finalItems.map((item) => ({
      ...item,
      available: item.total,
      createdAt: dayjs().unix(),
      updatedAt: dayjs().unix(),
    }));

    await db.insert(books).values(values);

    return c.json(
      {
        successCount: values.length,
        failureCount: failures.length,
        failures,
      },
      200,
    );
  });

export type BookAppType = typeof bookApp;
