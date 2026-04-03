import type { UpdateBookRequest } from '@repo/db/types/update.type';
import { apiClient } from '@/lib/api-client';

export const getBookQuery = (id: string) => ({
  queryKey: ['book', id],
  queryFn: async () => {
    const response = await apiClient.books[':id'].$get({
      param: { id },
    });
    if (!response.ok) {
      throw new Error('获取图书失败');
    }

    return await response.json();
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
    return await response.json();
  },
};
//删除图书
export const deleteBookMutation = {
  mutationKey: ['books', 'delete'],
  mutationFn: async (id: string) => {
    const response = await apiClient.books[':id'].$delete({
      param: { id },
    });
    return await response.json();
  },
};
//修改图书
export const updateBookMutation = {
  mutationKey: ['books', 'update'],
  mutationFn: async ({ id, book }: { id: string; book: UpdateBookRequest }) => {
    const response = await apiClient.books[':id'].$put({
      param: { id },
      json: book,
    });
    return await response.json();
  },
};
