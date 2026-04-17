import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { renewalRecords } from '@repo/db/schema/borrow-schema';
import { renewalSchema } from '@repo/types/src/renewal/renewal.type';
import { getSession } from 'server/src/lib/get-session';
import { eq, asc,and,ilike,or} from 'drizzle-orm';
import { books } from '@repo/db/schema/book-schema';
import { user } from '@repo/db/schema/auth-schema';
import dayjs from 'dayjs';
import { borrowRecords } from '@repo/db/schema/borrow-schema';
import { addRenewalSchema } from '@repo/types/src/renewal/add-renewal.type';
import {
  conflict,
  errorSchema,
  forbidden,
  notFound,
  unauthorized,
} from 'server/src/lib/api-error';

const app = new OpenAPIHono();

// 获取全部续借信息
export const listRenewal = createRoute({
  method: 'get',
  path: '/renewal',
  request: {
    query: z.object({
      keyword: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(renewalSchema),
        },
      },
      description: '获取全部记录信息',
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
})

// 添加续借信息
export const addRenewal = createRoute({
  method: 'post',
  path: '/renewal/{id}',
  request: {
    params: z.object({
      id: z.coerce.number(),
    }),
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: addRenewalSchema,
        },
      },
      description: '添加续借信息',
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
    404: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '借阅记录不存在',
    },
    409: {
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '续借状态冲突',
    },
  },
});

export const renewalApp =app
.openapi(listRenewal, async (c) => {
   const session = await getSession(c.req.raw.headers);
      if (!session) {
        throw unauthorized();
      }
       if (session.user.role === 'reader') {
            const { keyword } = c.req.valid('query');
            const search = keyword?.trim();
            const renewals = await db
              .select()
              .from(renewalRecords)
              .where(and(eq(renewalRecords.userId, session.user.id), search ? ilike(books.title, `%${search}%`) : undefined))
              .leftJoin(books, eq(renewalRecords.bookId, books.id))
              .leftJoin(user, eq(renewalRecords.userId, user.id))
              .orderBy(asc(renewalRecords.createdAt));
            const result = renewals.map((renewal) => {
              return {
                ...renewal.renewal_records,
                bookTitle: renewal.books?.title || '',
                userName: renewal.user?.name || '',
              };
            });
            return c.json(result, 200);
          } 
          else {
            const { keyword } = c.req.valid('query');
            const search = keyword?.trim();
            const renewals = await db
              .select()
              .from(renewalRecords)
              .where(search ? 
                or(
                  ilike(books.title, `%${search}%`),
                  ilike(user.name, `%${search}%`)
                ) : undefined)
              .leftJoin(books, eq(renewalRecords.bookId, books.id))
              .leftJoin(user, eq(renewalRecords.userId, user.id))
              .orderBy(asc(renewalRecords.createdAt));
            const result = renewals.map((renewal) => {
              return {
                ...renewal.renewal_records,
                bookTitle: renewal.books?.title || '',
                userName: renewal.user?.name || '',
              };
            });
            return c.json(result, 200);
          }
})
.openapi(addRenewal, async (c) => {
  const session = await getSession(c.req.raw.headers);
  if (!session) {
    throw unauthorized();
  }
  const { id } = c.req.valid('param');
  const renewalResult = await db.transaction(async (tx) => {
    const [record] = await tx
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.id, id));

    if (!record) {
      throw notFound('借阅记录不存在');
    }

    if (session.user.role === 'reader' && record.userId !== session.user.id) {
      throw forbidden();
    }

    if (record.status === '已归还' || record.actualReturnDate) {
      throw conflict('该图书已归还，不能续借');
    }

    const [existingRenewal] = await tx
      .select()
      .from(renewalRecords)
      .where(eq(renewalRecords.borrowRecordId, id));

    if (existingRenewal) {
      throw conflict('该借阅记录已续借过');
    }

    const now = dayjs();
    await tx
      .update(borrowRecords)
      .set({
        status: '已续借',
        updatedAt: now.unix(),
        returnDate: now.add(15, 'day').unix(), // 归还时间 = 15天后
      })
      .where(eq(borrowRecords.id, id))
      .returning();

    const [created] = await tx
      .insert(renewalRecords)
      .values({
        userId: record.userId,
        bookId: record.bookId,
        borrowRecordId: record.id,
        borrowDate: now.unix(), // 申请/续借时间 = 当前时间
        returnDate: now.add(15, 'day').unix(), // 归还时间 = 15天后
        borrowTotal: record.borrowTotal,
        createdAt: now.unix(),
        updatedAt: now.unix(),
      })
      .returning();

    return created;
  });

  return c.json(renewalResult, 200);
})
;
