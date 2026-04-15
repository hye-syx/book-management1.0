import { apiClient } from '@/lib/api-client';
import type { UpdateBookType } from '@repo/types';
import type { AddBookType } from '@repo/types';

// 获取单个图书
export const getBookQuery = (id: number) => ({
  queryKey: ['book', id],
  queryFn: async () => {
    const response = await apiClient.books[':id'].$get({
      param: { id: String(id) },
    });
    const data = await response.json();
    if (!response.ok) {
      const message = typeof data === 'object' && data !== null && 'message' in data ? data.message : '获取图书失败';
      throw new Error(message);
    }

    return data;
  },
});

//获取全部图书
export const listBookQuery = {
  queryKey: ['books', 'all'],
  // queryFn: async () => {
  //     const response = await fetch('/api/books');
  //     return response.json();
  // }
  queryFn: async () => {
    const response = await apiClient.books.$get();
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '获取图书失败';
      throw new Error(message);
    }

    return data;
  },
};
//删除图书
export const deleteBookMutation = {
  mutationKey: ['books', 'delete'],
  mutationFn: async (id: number) => {
    const response = await apiClient.books[':id'].$delete({
      param: { id: String(id) },
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '删除图书失败';
      throw new Error(message);
    }

    return data;
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
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '修改图书失败';
      throw new Error(message);
    }

    return data;
  },
};
// 增加单本图书
export const addBookMutation = {
  mutationKey: ['books', 'add'],
  mutationFn: async (book: AddBookType.AddBookRequest) => {
    const response = await apiClient.books.$post({
      json: book,
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '增加图书失败';
      throw new Error(message);
    }

    return data;
  }
};
//
export const listBookByCategoryQuery = {
  queryKey: ['category', 'list'],
  queryFn: async () => {
    const response = await apiClient.categories.$get();
    return await response.json();
  }
};
