import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { user } from '@repo/db/schema/auth-schema';
import { books } from '@repo/db/schema/book-schema';
import { borrowRecords } from '@repo/db/schema/borrow-schema';
import { recordSchema } from '@repo/types/src/record/record.type';
import { updateRecordSchema } from '@repo/types/src/record/update-record.type';
import { eq, sql } from 'drizzle-orm';
import { getSession } from 'server/src/lib/get-session';
import dayjs from 'dayjs';

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
// 编辑记录
export const editRecordRoute = createRoute({
  method: 'put',
  path: '/records/{id}',
  request: {
    params: z.object({
      id: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateRecordSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: recordSchema,
        },
      },
      description: '编辑记录',
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
// 获取单个记录
export const getRecordRoute = createRoute({
  method: 'get',
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
          schema: recordSchema,
        },
      },
      description: '获取单个记录',
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
.openapi(editRecordRoute, async (c) => {
  const session = await getSession(c.req.raw.headers);
  if (!session) {
    return c.json({ message: '未登录' }, 401);
  }
  if(session.user.role==='reader'){
    return c.json({ message: '权限不足' }, 403);
  }
  const { id } = c.req.valid('param');
  const body = await c.req.json();
  const record = updateRecordSchema.parse(body);
  const recordStatus=record.status;
  const updateRecord = await db.transaction(async (tx) => {
    const [upRecord] = await tx
      .update(borrowRecords)
      .set({ ...record, updatedAt: dayjs().unix() })
      .where(eq(borrowRecords.id, id))
      .returning();
    if(recordStatus==='已归还'){
      // 更新书籍状态
      await tx
        .update(books)
        .set({
          available: sql`${books.available} + ${record.borrowTotal}`,
          status: '在馆'
        
        })
        .where(eq(books.id, record.bookId))
        .returning();
    }
    const [fullRecord] = await tx
    .select()
    .from(borrowRecords)
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(user, eq(borrowRecords.userId, user.id))
    .where(eq(borrowRecords.id, id))
    return {
      ...upRecord,
      bookTitle: fullRecord?.books?.title || '',
      userName: fullRecord?.user?.name || '',
    };
  })
  return c.json(updateRecord, 200);
})
.openapi(getRecordRoute, async (c) => {
  const session = await getSession(c.req.raw.headers);
  if (!session) {
    return c.json({ message: '未登录' }, 401);
  }
  const { id } = c.req.valid('param');
  const [record] = await db
    .select()
    .from(borrowRecords)
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(user, eq(borrowRecords.userId, user.id))
    .where(eq(borrowRecords.id, id))
    return c.json({
      ...record.borrow_records,
      bookTitle: record.books?.title || '',
      userName: record.user?.name || '',
    }, 200);
}); 
;
