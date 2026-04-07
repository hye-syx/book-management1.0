import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type categoryType = z.infer<typeof categorySchema>;
