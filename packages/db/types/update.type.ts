import { z } from 'zod';

export const updateBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  publicationDate: z.coerce.date(),
  categoryId: z.string(),
  price: z.number(),
  total: z.number(),
  available: z.number(),
  status: z.enum(['在馆', '借出', '遗失', '损坏']).nullable(),

});
