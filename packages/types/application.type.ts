import { z } from 'zod';

export const applicationSchema = z.object({
  id: z.number(),
  userId: z.string(),
  bookId: z.number(),
  borrowTotal:z.number(),
  borrowDate: z.number(),
  returnDate: z.number(),
  status: z.enum(['待审核', '已批准', '已拒绝', '已取消']).nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
  userName: z.string(),
  bookTitle: z.string(),
});

export type Application = z.infer<typeof applicationSchema>;