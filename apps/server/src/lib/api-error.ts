import { z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';

export const errorSchema = z.object({
  message: z.string(),
});

export class AppError extends HTTPException {
  constructor(status: 400 | 401 | 403 | 404 | 409 | 500, message: string) {
    super(status, { message });
  }
}

export const unauthorized = (message = '未登录') =>
  new AppError(401, message);

export const forbidden = (message = '没有权限') =>
  new AppError(403, message);

export const badRequest = (message: string) =>
  new AppError(400, message);

export const notFound = (message: string) =>
  new AppError(404, message);

export const conflict = (message: string) =>
  new AppError(409, message);
