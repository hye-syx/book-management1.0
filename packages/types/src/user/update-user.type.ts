import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.enum(['admin', 'librarian', 'reader']).optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;