import type { ApplicationDialogType } from '@repo/types';
import type { ApplicationReviewRequest } from '@repo/types/src/application/applicationReview.type';
import { apiClient } from '#/lib/api-client';

// 获取所有图书的申请
export const listApplicationQuery = {
  queryKey: ['applications', 'all'],
  queryFn: async () => {
    const response = await apiClient.applications.$get();
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '获取图书申请失败';
      throw new Error(message);
    }

    return data;
  },
};
// 新增申请
export const addApplicationMutation = {
  mutationKey: ['applications', 'add'],
  mutationFn: async (data: ApplicationDialogType.ApplicationDialogRequest) => {
    const response = await apiClient.applications.$post({
      json: data,
    });
     const result = await response.json();
    if (!response.ok) {
      const message =
        typeof result === 'object' && result !== null && 'message' in result
          ? result.message
          : '增加申请失败';
      throw new Error(message);
    }

    return result;
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
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '批准申请失败';
      throw new Error(message);
    }

    return data;
  },
};
