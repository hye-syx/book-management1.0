import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { user } from '@repo/db/schema/auth-schema';
import { books } from '@repo/db/schema/book-schema';
import { borrowRecords } from '@repo/db/schema/borrow-schema';
import { recordSchema } from '@repo/types/src/record/record.type';
import { eq } from 'drizzle-orm';
import { getSession } from 'server/src/lib/get-session';

const app = new OpenAPIHono();
// 获取全部申请记录
export const listRecordsRoute = createRoute({
  method: 'get',
  path: '/records',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(recordSchema),
        },
      },
      description: '获取全部记录信息',
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
// 删除记录
export const deleteRecordRoute = createRoute({
  method: 'delete',
  path: '/records/{id}',
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
      description: '删除记录',
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
    403: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: '权限不足',
    },
  },
});
export const recordsApp = app
.openapi(listRecordsRoute, async (c) => {
  const session = await getSession(c.req.raw.headers);
  if (!session) {
    return c.json({ message: '未登录' }, 401);
  }
  if(session.user.role==='reader'){
     const records = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.userId,session.user.id))
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .leftJoin(user, eq(borrowRecords.userId, user.id))
      .orderBy(borrowRecords.createdAt);
    const result = records.map((record) => {
      return {
        ...record.borrow_records,
        bookTitle: record.books?.title || '',
        userName: record.user?.name || '',
      };
    });
    return c.json(result,200);
  }else{
     const records = await db
      .select()
      .from(borrowRecords)
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .leftJoin(user, eq(borrowRecords.userId, user.id))
      .orderBy(borrowRecords.createdAt);

    const result = records.map((record) => {
      return {
        ...record.borrow_records,
        bookTitle: record.books?.title || '',
        userName: record.user?.name || '',
      };
    });
    return c.json(result, 200);
  }
})
.openapi(deleteRecordRoute, async (c) => {
  const session = await getSession(c.req.raw.headers);
  if (!session) {
    return c.json({ message: '未登录' }, 401);
  }
  if(session.user.role==='reader'){
    return c.json({ message: '权限不足' }, 403);
  }
  const { id } = c.req.valid('param');
   await db
    .delete(borrowRecords)
    .where(eq(borrowRecords.id, id))
    .returning();
  return c.json({ message: '删除成功' }, 200);
})
;
