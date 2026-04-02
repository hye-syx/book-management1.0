import { z } from 'zod';

export const updateBookSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  publicationDate: z.coerce.date().optional(),
  categoryId: z.string().optional(),
  price: z.number().optional(),
  total: z.number().optional(),
  available: z.number().optional(),
  status: z.enum(['在馆', '借出', '遗失', '损坏']).nullable().optional(),
});

export type UpdateBookRequest = z.infer<typeof updateBookSchema>;
