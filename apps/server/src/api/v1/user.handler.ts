import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@repo/db';
import { eq } from 'drizzle-orm';
import { user } from '@repo/db/schema/auth-schema';
import { userSchema } from '@repo/types/src/user/user.type';
import { updateUserSchema } from '@repo/types/src/user/update-user.type';
import {
  errorSchema,
  forbidden,
  unauthorized,
} from 'server/src/lib/api-error';
import { getSession } from 'server/src/lib/get-session';

const app = new OpenAPIHono();
// 获取全部用户信息
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
// 获取单个用户信息
export const getUserRoute = createRoute({
  method: 'get',
  path: '/user/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
      description: '获取单个用户信息',
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
// 编辑用户信息
export const updateUserRoute = createRoute({
  method: 'put',
  path: '/user/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
      description: '编辑用户信息',
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
// 删除用户信息
export const deleteUserRoute=createRoute({
  method: 'delete',
  path: '/user/{id}',
  request: {
    params: z.object({
      id: z.string(),
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
    403:{
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
      description: '没有权限',
    }
  },
});

export const userApp = app
  .openapi(listUserRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role !== 'admin') {
      throw forbidden('权限不足');
    }
    const users = await db.select().from(user);
    return c.json(users, 200);
  })
  .openapi(updateUserRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role !== 'admin') {
      throw forbidden('权限不足');
    }
    const { id } = c.req.param();
    const body = await c.req.json();
    const userinfo = updateUserSchema.parse(body);
    const [updated] = await db
      .update(user)
      .set({
        ...userinfo,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning();
    return c.json(updated, 200);
  })
  .openapi(getUserRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role !== 'admin') {
      throw forbidden('权限不足');
    }
    const { id } = c.req.param();
    const [userResult] = await db.select().from(user).where(eq(user.id, id));
    return c.json(userResult, 200);
  })
  .openapi(deleteUserRoute, async (c) => {
    const session = await getSession(c.req.raw.headers);
    if (!session) {
      throw unauthorized();
    }
    if (session.user.role !== 'admin') {
      throw forbidden('权限不足');
    }
    const { id } = c.req.param();
    await db.delete(user).where(eq(user.id, id));
    return c.json({message:'删除成功'}, 200);
  });

export type UserAppType = typeof userApp;
