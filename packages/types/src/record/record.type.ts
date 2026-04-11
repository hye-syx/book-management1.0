import { z } from 'zod';

export const recordSchema = z.object({
  id: z.number(),
  userId: z.string(),
  bookId: z.number(),
  borrowDate: z.number(),
  returnDate: z.number(),
  actualReturnDate: z.number().optional().nullable(),
  overdueDays: z.number().optional().nullable(),
  borrowTotal: z.number(),
  status: z.enum(['借阅中', '已归还', '逾期']),
  userName: z.string(),
  bookTitle: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type RecordRequest = z.infer<typeof recordSchema>;
