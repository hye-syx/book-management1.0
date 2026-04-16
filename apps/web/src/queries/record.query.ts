import { apiClient } from "#/lib/api-client";
import { throwApiError } from "#/lib/api-error";
import type { UpdateRecordRequest } from "@repo/types/src/record/update-record.type";

export const listRecordsQuery = {
  queryKey: ['records', 'all'],
  queryFn: async () => {
    const response = await apiClient.records.$get();
    if (!response.ok) {
      return throwApiError(response, '获取借阅记录失败');
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
    if (!response.ok) {
      return throwApiError(response, '删除借阅记录失败');
    }

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
    if (!response.ok) {
      return throwApiError(response, '修改借阅记录失败');
    }

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
      return throwApiError(response, '获取记录失败');
    }

    return await response.json();
  },
});
// 归还图书
export const returnBookMutation = {
  mutationKey: ['records', 'return'],
  mutationFn: async (id: number) => {
    const response = await apiClient.records[':id'].return.$patch({
      param: { id: String(id) },
    });
    if (!response.ok) {
      return throwApiError(response, '归还图书失败');
    }

    return await response.json();
  },
}
