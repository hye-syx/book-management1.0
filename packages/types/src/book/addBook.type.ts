import { z } from 'zod';

export const addBookSchema = z.object({
  isbn: z.string(),
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  publicationDate: z.number(), // unix时间戳
  categoryId: z.string(),
  price: z.number(),
  total: z.number(),
//   available: z.number(),
  status: z.enum(['在馆', '借出', '遗失', '损坏']).nullable(),
});

export const batchAddBookSchema = z.object({
  items: z.array(addBookSchema).min(1, '至少导入一条图书数据'),
});

export const batchAddBookResultSchema = z.object({
  successCount: z.number(),
  failureCount: z.number(),
  failures: z.array(
    z.object({
      row: z.number(),
      reason: z.string(),
    }),
  ),
});


export type AddBookRequest = z.infer<typeof addBookSchema>;
export type BatchAddBookRequest = z.infer<typeof batchAddBookSchema>;
export type BatchAddBookResult = z.infer<typeof batchAddBookResultSchema>;