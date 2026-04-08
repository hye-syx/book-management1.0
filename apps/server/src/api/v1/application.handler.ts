import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { applicationSchema } from "@repo/types/application.type";
import { applicationDialogSchema} from "@repo/types/application-dialog.type";
import { db } from "@repo/db";
import { borrowApplications } from "@repo/db/schema/borrow-schema";
import { books } from "@repo/db/schema/book-schema";
import { eq } from "drizzle-orm";
import { user } from "@repo/db/schema/auth-schema";
import { getSession } from "server/src/lib/get-session";
import dayjs from "dayjs";


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
})

.openapi(createApplicationRoute, async(c) => {
  const session = await getSession(c.req.raw.headers);
  if (!session) {
    return c.json({ message: '未登录' }, 401);
  }
  const body = await c.req.json();
  const application = applicationDialogSchema.parse(body);
 const borrowDate= application.borrowDate;
 const returnDate= application.returnDate;
 const bookId=application.bookId;
 if(borrowDate>=returnDate){
  return c.json({ message: '借阅日期不能早于归还日期' }, 400);
 }
 //  获取可用数量
const [book] = await db.select().from(books).where(eq(books.id, bookId));
 if(!book){
  return c.json({ message: '书籍不存在' }, 400);
 }
 if(book.available<=0){
  return c.json({ message: '书籍不可借' }, 400);
 }
  const [applications] = await db.insert(borrowApplications).values({
    ...application,
    status: '待审核',
    createdAt: dayjs().unix(), 
    updatedAt: dayjs().unix(),
  }).returning();
  return c.json(applications,200);
});

export type ApplicationAppType = typeof applicationApp;
