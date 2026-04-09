import { z } from "zod";

export const applicationReviewSchema = z.object({
    status: z.enum(['已批准', '已拒绝','已取消']),
})
export type ApplicationReviewRequest = z.infer<typeof applicationReviewSchema>