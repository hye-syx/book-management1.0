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
export type AddBookRequest = z.infer<typeof addBookSchema>;