import { apiClient } from "#/lib/api-client";
import type { UpdateRecordRequest } from "@repo/types/src/record/update-record.type";

export const listRecordsQuery = {
  queryKey: ['records', 'all'],
  queryFn: async () => {
    const response = await apiClient.records.$get();

    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '获取借阅记录失败';
      throw new Error(message);
    }
    return data;
  },
};
export const deleteRecordsMutation = {
  mutationKey:['records','delete'],
  mutationFn: async (id: number) => {
    const response = await apiClient.records[':id'].$delete({
      param: { id: String(id) },
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '删除借阅记录失败';
      throw new Error(message);
    }

    return data;
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
    const result = await response.json();
    if (!response.ok) {
      const message =
        typeof result === 'object' && result !== null && 'message' in result
          ? result.message
          : '修改借阅记录失败';
      throw new Error(message);
    }

    return data;
  },
};
// 获取单个记录
export const getRecordQuery = (recordId: number) => ({
  queryKey: ['records', recordId],
  queryFn: async () => {
    const response = await apiClient.records[':id'].$get({
      param: { id: String(recordId) },
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '获取记录失败';
      throw new Error(message);
    }

    return data;
  },
});
// 归还图书
export const returnBookMutation = {
  mutationKey: ['records', 'return'],
  mutationFn: async (id: number) => {
    const response = await apiClient.records[':id'].return.$patch({
      param: { id: String(id) },
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '归还图书失败';
      throw new Error(message);
    }

    return data;
  },
}
