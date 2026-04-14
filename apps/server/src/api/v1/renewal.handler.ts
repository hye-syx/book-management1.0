import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { renewalRecords } from '@repo/db/schema/borrow-schema';
import { renewalSchema } from '@repo/types/src/renewal/renewal.type';
import { getSession } from 'server/src/lib/get-session';
import { eq, asc } from 'drizzle-orm';
import { books } from '@repo/db/schema/book-schema';
import { user } from '@repo/db/schema/auth-schema';

const app = new OpenAPIHono();

// 获取全部续借信息
export const listRenewal = createRoute({
  method: 'get',
  path: '/renewal',
  request: {},
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
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: '未登录',
    },
  },
})

export const renewalApp =app
.openapi(listRenewal, async (c) => {
   const session = await getSession(c.req.raw.headers);
      if (!session) {
        return c.json({ message: '未登录' }, 401);
      }
       if (session.user.role === 'reader') {
            const renewals = await db
            .select()
            .from(renewalRecords)
            .where(eq(renewalRecords.userId, session.user.id))
            .leftJoin(books,eq(renewalRecords.bookId,books.id))
            .leftJoin(user,eq(renewalRecords.userId,user.id))
            .orderBy(asc(renewalRecords.createdAt))
            ;
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
            const renewals = await db
              .select()
              .from(renewalRecords)
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
});


