import { apiClient } from "#/lib/api-client";

export const listRenewalQuery = {
  queryKey: ['renewals', 'all'],
  queryFn: async () => {
    const response = await apiClient.renewal.$get();
    if (!response.ok) {
      throw new Error('获取续借记录失败');
    }
    return await response.json();
  },
};
