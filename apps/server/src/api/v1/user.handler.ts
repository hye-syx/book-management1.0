import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "@repo/db";
import { user } from "@repo/db/schema/auth-schema";
import { userSchema } from "@repo/types/use.type";
import { getSession } from "server/src/lib/get-session";



const app = new OpenAPIHono();
// 获取全部申请信息
export const listUserRoute = createRoute({
  method: 'get',
  path: '/user',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(userSchema),
        },
      },
      description: '获取全部用户信息',
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
      description: '没有权限',
    },
  },
});


export const userApp = app
.openapi(listUserRoute, async(c)=>{
    const session =await getSession(c.req.raw.headers);
    if (!session) {
        return c.json({ message: '未登录' }, 401);
    }
    if(session.user.role!=='admin'){
        return c.json({message:'权限不足'}, 403);
    }
    const users = await db.select().from(user)
    return c.json(users,200);
})


export type UserAppType = typeof userApp;
