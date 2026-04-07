import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { applicationSchema } from "@repo/types/application.type";
import { db } from "@repo/db";
import { borrowApplications } from "@repo/db/schema/borrow-schema";
import { books } from "@repo/db/schema/book-schema";
import { eq } from "drizzle-orm";
import { user } from "@repo/db/schema/auth-schema";

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
  },
});
export const applicationApp=app
.openapi(listApplicationRoute, async(c) => {
    const applications = await db
      .select()
      .from(borrowApplications)
      .leftJoin(books, eq(borrowApplications.bookId,books.id))
      .leftJoin(user,eq(borrowApplications.userId,user.id));
      const result = applications.map((item) => {
        return {
          ...item.borrow_applications,
          bookTitle: item.books?.title || '',
          userName: item.user?.name || '',
        };
      });
  return c.json(result,200);
});

export type ApplicationAppType = typeof applicationApp;
