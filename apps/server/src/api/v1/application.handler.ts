import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { user } from '@repo/db/schema/auth-schema';
import { bookStatusEnum, books } from '@repo/db/schema/book-schema';
import { borrowApplications } from '@repo/db/schema/borrow-schema';
import { applicationSchema } from '@repo/types/src/application/application.type';
import { applicationDialogSchema } from '@repo/types/src/application/application-dialog.type';
import { applicationReviewSchema } from '@repo/types/src/application/applicationReview.type';
import { applicationUpdateSchema } from '@repo/types/src/application/applicationUpdate.type';
import dayjs from 'dayjs';
import { asc, eq, sql } from 'drizzle-orm';
import { getSession } from 'server/src/lib/get-session';

const app = new OpenAPIHono();
// 获取全部申请信息
export const listApplicationRoute = createRoute({
  method: 'get',
  path: '/applications',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(applicationSchema),
        },
      },
      description: '获取全部申请信息',
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
// 新增申请信息
export const createApplicationRoute = createRoute({
  method: 'post',
  path: '/applications',
  request: {
    body: {
      content: {
        'application/json': {
          schema: applicationDialogSchema,
        },
      },
      description: '新增申请信息',
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: applicationDialogSchema,
        },
      },
      description: '新增申请信息',
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
    400: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: '参数错误',
    },
  },
});
// 批准申请信息
export const reviewApplicationRoute = createRoute({
  method: 'patch',
  path: '/applications/{id}/review',
  request: {
    params: z.object({
      id: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: applicationReviewSchema,
        },
      },
      description: '批准申请信息',
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: applicationUpdateSchema,
        },
      },
      description: '批准申请信息',
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
    400: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: '参数错误',
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

export const applicationApp = app
  .openapi(listApplicationRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      return c.json({ message: '未登录' }, 401);
    }
    if(session.user.role === 'reader') {
      // 只能查看自己的申请
      const applications = await db
        .select()
        .from(borrowApplications)
        .where(eq(borrowApplications.userId, session.user.id))
        .leftJoin(books, eq(borrowApplications.bookId, books.id))
        .leftJoin(user, eq(borrowApplications.userId, user.id))
        .orderBy(asc(borrowApplications.createdAt));
      const result = applications.map((item) => {
        return {
          ...item.borrow_applications,
          bookTitle: item.books?.title || '',
          userName: item.user?.name || '',
        };
      });
      return c.json(result, 200);
    }else {
      const applications = await db
        .select()
        .from(borrowApplications)
        .leftJoin(books, eq(borrowApplications.bookId, books.id))
        .leftJoin(user, eq(borrowApplications.userId, user.id))
        .orderBy(asc(borrowApplications.createdAt));
      const result = applications.map((item) => {
        return {
          ...item.borrow_applications,
          bookTitle: item.books?.title || '',
          userName: item.user?.name || '',
        };
      });
      return c.json(result, 200);
    }
  })
  .openapi(createApplicationRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      return c.json({ message: '未登录' }, 401);
    }
    const body = await c.req.json();
    const application = applicationDialogSchema.parse(body);
    const borrowDate = application.borrowDate;
    const returnDate = application.returnDate;
    const borrowTotal = application.borrowTotal;
    const bookId = application.bookId;
    if (borrowDate >= returnDate) {
      return c.json({ message: '借阅日期不能早于归还日期' }, 400);
    }
    try {
      const [book] = await db.select().from(books).where(eq(books.id, bookId));
      if (!book) {
        throw new Error('书籍不存在');
      }
      if (book.available < borrowTotal) {
        throw new Error('可借阅书籍不够');
      }

      const addApplication = await db.transaction(async (tx) => {
        await tx
          .update(books)
          .set({
            available: book.available - borrowTotal,
          })
          .where(eq(books.id, bookId));
        const [applications] = await tx
          .insert(borrowApplications)
          .values({
            ...application,
            userId: session.user.id,
            status: '待审核',
            createdAt: dayjs().unix(),
            updatedAt: dayjs().unix(),
          })
          .returning();
        const remainingAvailable = book.available - borrowTotal;
        if (!remainingAvailable) {
          await tx
            .update(books)
            .set({
              status: '借出', // 借阅中
              updatedAt: dayjs().unix(),
            })
            .where(eq(books.id, bookId));
        }
        return applications;
      });

      return c.json(addApplication, 200);
    } catch (error) {
      const message = error instanceof Error ? error.message : '审核失败';
      if(message === '借阅日期不能早于归还日期' || message === '书籍不存在' || message === '可借阅书籍不够') {
        return c.json({ message }, 400);
      }
      return c.json({ message: '创建借阅申请失败' }, 400);
    }
  })

  .openapi(reviewApplicationRoute, async (c) => {
    // 验证是否登录
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      return c.json({ message: '未登录' }, 401);
    }
    const { id } = c.req.valid('param');
    const body = await c.req.json();
    const { status } = applicationReviewSchema.parse(body);
    try {
      const updatedApplication = await db.transaction(async (tx) => {
        const [application] = await tx
          .select()
          .from(borrowApplications)
          .where(eq(borrowApplications.id, id));
        if (!application) {
          throw new Error('申请不存在');
        }
        if (application.status !== '待审核') {
          throw new Error('申请状态不是待审核');
        }
        // 权限设置
        if (status === '已取消' && application.userId !== session.user.id) {
          throw new Error('只能取消自己的申请');
        }
        if((status === '已批准' || status === '已拒绝') && session.user.role === 'reader') {
          throw new Error('只有管理员或图书管理员才能通过或拒绝申请');
        }
        switch (status) {
          case '已拒绝': {
            const [rejectApplication] = await tx
              .update(borrowApplications)
              .set({
                status: '已拒绝',
                updatedAt: dayjs().unix(),
              })
              .where(eq(borrowApplications.id, id))
              .returning();
            await tx
              .update(books)
              .set({
                available: sql`${books.available} + ${application.borrowTotal}`,
              })
              .where(eq(books.id, application.bookId));
            return rejectApplication;
          }

          case '已取消': {
            const [cancelApplication] = await tx
              .update(borrowApplications)
              .set({
                status: '已取消',
                updatedAt: dayjs().unix(),
              })
              .where(eq(borrowApplications.id, id))
              .returning();
            return cancelApplication;
          }

          case '已批准': {
            // await tx
            //   .update(books)
            //   .set({
            //     available: sql`${books.available} - ${application.borrowTotal}`,
            //     updatedAt: dayjs().unix(),
            //   })
            //   .where(eq(books.id, application.bookId))
            //   .returning();

            const [approvedApplication] = await tx
              .update(borrowApplications)
              .set({
                status: '已批准',
                updatedAt: dayjs().unix(),
              })
              .where(eq(borrowApplications.id, id))
              .returning();
            return approvedApplication;
          }

          default: {
            throw new Error('不支持的申请状态');
          }
        }
      });
      return c.json(updatedApplication, 200);
    } catch (error) {
      const message = error instanceof Error ? error.message : '审核失败';
      if (message === '申请不存在') {
        return c.json({ message }, 400);
      }
      if (message === '只能取消自己的申请') return c.json({ message }, 403);
      if (message === '只有管理员或图书管理员才能通过或拒绝申请')return c.json({ message }, 403);
      if (message === '申请状态不是待审核') return c.json({ message }, 400);
      return c.json({ message }, 400);
    }
  });

export type ApplicationAppType = typeof applicationApp;
