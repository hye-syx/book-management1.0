import { z } from 'zod';

export const updateRecordSchema = z.object({
  bookId: z.number(),
  userId: z.string(),
  borrowDate: z.number(),
  returnDate: z.number(),
  actualReturnDate: z.number().optional().nullable(),
  overdueDays: z.number().optional().nullable(),
  borrowTotal: z.number(),
  status: z.enum(['借阅中', '已归还', '逾期']),
});
export type UpdateRecordRequest = z.infer<typeof updateRecordSchema>;
