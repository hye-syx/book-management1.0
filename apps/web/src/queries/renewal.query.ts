import { apiClient } from "#/lib/api-client";

export const listRenewalQuery = {
  queryKey: ['renewals', 'all'],
  queryFn: async () => {
    const response = await apiClient.renewal.$get();
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || '获取续借记录失败');
    }
    return data;
  },
};

export const addRenewalMutation = {
  mutationFn: async (id: number) => {
    const response = await apiClient.renewal[':id'].$post({
     param:{id:(String(id))}
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || '添加续借记录失败');
    }
    return data;
  },
};
