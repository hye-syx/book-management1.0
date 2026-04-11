import { apiClient } from "#/lib/api-client";

export const listRecordsQuery = {
  queryKey: ['records', 'all'],
  queryFn: async () => {
    const response = await apiClient.records.$get();
    if (!response.ok) {
      throw new Error('获取借阅记录失败');
    }
    return await response.json();
  },
};
