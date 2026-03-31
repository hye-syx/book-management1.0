
import { z } from "zod";

export const bookSchema =z.object({
  id:z.string(),
  isbn: z.string(),
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  publicationDate: z.date(),
  categoryId: z.string(),
  price: z.number(),
  total: z.number(),
  available: z.number(),
  status: z.enum(["在馆", "借出", "遗失", "损坏"]).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
