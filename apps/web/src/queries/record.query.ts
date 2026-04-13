import { apiClient } from "#/lib/api-client";
import type { UpdateRecordRequest } from "@repo/types/src/record/update-record.type";

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
export const deleteRecordsMutation = {
  mutationKey:['records','delete'],
  mutationFn: async (id: number) => {
    const response = await apiClient.records[':id'].$delete({
      param: { id: String(id) },
    });
    return await response.json();
  },
}
// 修改记录
export const editRecordMutation = {
  mutationKey: ['records', 'edit'],
  mutationFn: async ({ id, data }: { id: number; data: UpdateRecordRequest }) => {
    const response = await apiClient.records[':id'].$put({
      param: { id: String(id) },
      json: data,
    });
    return await response.json();
  },
};
// 获取单个记录
export const getRecordQuery = (recordId: number) => ({
  queryKey: ['records', recordId],
  queryFn: async () => {
    const response = await apiClient.records[':id'].$get({
      param: { id: String(recordId) },
    });
    if (!response.ok) {
      throw new Error('获取借阅记录失败');
    }
    return await response.json();
  },
});
