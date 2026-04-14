import { z } from 'zod';

export const renewalSchema = z.object({
  id: z.number(),
  userId: z.string(),
  bookId: z.number(),
  borrowDate: z.number(),
  returnDate: z.number(),
  borrowTotal: z.number(),
  userName: z.string(),
  bookTitle: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type RenewalRequest = z.infer<typeof renewalSchema>;
