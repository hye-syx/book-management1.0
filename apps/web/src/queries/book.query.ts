import { apiClient } from '@/lib/api-client';
import { throwApiError } from '@/lib/api-error';
import type { AddBookType } from '@repo/types';
import type { UpdateBookType } from '@repo/types';

// 获取单个图书
export const getBookQuery = (id: number) => ({
  queryKey: ['book', id],
  queryFn: async () => {
    const response = await apiClient.books[':id'].$get({
      param: { id: String(id) },
    });
    if (!response.ok) {
      return throwApiError(response, '获取图书失败');
    }

    return await response.json();
  },
});

//获取全部图书
export const listBookQuery = (keyword:string)=>({
  queryKey: ['books', 'list',keyword],
  queryFn: async () => {
    const response = await apiClient.books.$get({
      query:{ keyword },
    });
    if (!response.ok) {
      return throwApiError(response, '获取图书失败');
    }

    return await response.json();
  },
});
//删除图书
export const deleteBookMutation = {
  mutationKey: ['books', 'delete'],
  mutationFn: async (id: number) => {
    const response = await apiClient.books[':id'].$delete({
      param: { id: String(id) },
    });
    if (!response.ok) {
      return throwApiError(response, '删除图书失败');
    }

    return await response.json();
  },
};
//修改图书
export const updateBookMutation = {
  mutationKey: ['books', 'update'],
  mutationFn: async ({ id, book }: { id: number; book: UpdateBookType.UpdateBookRequest }) => {
    const response = await apiClient.books[':id'].$put({
      param: { id: String(id) },
      json: book,
    });
    if (!response.ok) {
      return throwApiError(response, '修改图书失败');
    }

    return await response.json();
  },
};
// 增加单本图书
export const addBookMutation = {
  mutationKey: ['books', 'add'],
  mutationFn: async (book: AddBookType.AddBookRequest) => {
    const response = await apiClient.books.$post({
      json: book,
    });
    if (!response.ok) {
      return throwApiError(response, '增加图书失败');
    }

    return await response.json();
  },
};
//
export const listBookByCategoryQuery = {
  queryKey: ['category', 'list'],
  queryFn: async () => {
    const response = await apiClient.categories.$get();
    if (!response.ok) {
      return throwApiError(response, '获取分类失败');
    }

    return await response.json();
  },
};
