import { z } from 'zod';

export const applicationDialogSchema = z.object({
  userId: z.string(),
  bookId: z.number(),
  borrowDate: z.number(),
  returnDate: z.number(),
  status: z.enum(['待审核', '已批准', '已拒绝', '已取消']).nullable(),
});
export type ApplicationDialogRequest = z.infer<typeof applicationDialogSchema>;
