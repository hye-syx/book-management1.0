import type { ApplicationDialogType } from '@repo/types';
import type { ApplicationReviewRequest } from '@repo/types/applicationReview.type';
import { apiClient } from '#/lib/api-client';

// 获取所有图书的申请
export const listApplicationQuery = {
  queryKey: ['applications', 'all'],
  queryFn: async () => {
    const response = await apiClient.applications.$get();
    return await response.json();
  },
};
// 新增申请
export const addApplicationMutation = {
  mutationKey: ['applications', 'add'],
  mutationFn: async (data: ApplicationDialogType.ApplicationDialogRequest) => {
    const response = await apiClient.applications.$post({
      json: data,
    });
    return await response.json();
  },
};
// 批准申请
export const reviewApplicationMutation = {
  mutationKey: ['applications', 'review'],
  mutationFn: async ({
    id,
    status,
  }: {
    id: number;
    status: ApplicationReviewRequest['status'];
  }) => {
    const response = await apiClient.applications[':id'].review.$patch({
      param: { id: String(id) },
      json: { status },
    });
    return await response.json();
  },
};
