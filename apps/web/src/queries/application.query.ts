import { apiClient } from "#/lib/api-client";
import type { ApplicationDialogRequest } from '../../../../packages/types/application-dialog.type';

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
  mutationFn: async (data: ApplicationDialogRequest) => {
    const response = await apiClient.applications.$post({
      json: data,
    });
    return await response.json();
  },
};