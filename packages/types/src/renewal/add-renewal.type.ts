import { z } from 'zod';

export const addRenewalSchema = z.object({
  userId: z.string(),
  bookId: z.number(),
  borrowDate: z.number(),
  returnDate: z.number(),
  borrowTotal: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type AddRenewalRequest = z.infer<typeof addRenewalSchema>;
