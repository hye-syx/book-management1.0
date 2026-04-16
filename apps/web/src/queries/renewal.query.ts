import { apiClient } from "#/lib/api-client";
import { throwApiError } from "#/lib/api-error";

export const listRenewalQuery = {
  queryKey: ['renewals', 'all'],
  queryFn: async () => {
    const response = await apiClient.renewal.$get();
    if (!response.ok) {
      return throwApiError(response, '获取续借记录失败');
    }
    return await response.json();
  },
};

export const addRenewalMutation = {
  mutationFn: async (id: number) => {
    const response = await apiClient.renewal[':id'].$post({
     param:{id:(String(id))}
    });

    if (!response.ok) {
      return throwApiError(response, '添加续借记录失败');
    }
    return await response.json();
  },
};
