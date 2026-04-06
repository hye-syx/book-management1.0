import { apiClient } from '@/lib/api-client';
import type { UpdateBookRequest } from '../../../../packages/types/update.type';
import type { AddBookRequest } from '../../../../packages/types/addBook.type';

// 获取单个图书
export const getBookQuery = (id: number) => ({
  queryKey: ['book', id],
  queryFn: async () => {
    const response = await apiClient.books[':id'].$get({
      param: { id: String(id) },
    });
    // if (!response.ok) {
    //   throw new Error('获取图书失败');
    // }

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
  mutationFn: async (id: number) => {
    const response = await apiClient.books[':id'].$delete({
      param: { id: String(id) },
    });
    return await response.json();
  },
};
//修改图书
export const updateBookMutation = {
  mutationKey: ['books', 'update'],
  mutationFn: async ({ id, book }: { id: number; book: UpdateBookRequest }) => {
    const response = await apiClient.books[':id'].$put({
      param: { id: String(id) },
      json: book,
    });
    return await response.json();
  },
};
// 增加单本图书
export const addBookMutation = {
  mutationKey: ['books', 'add'],
  mutationFn: async (book: AddBookRequest) => {
    const response = await apiClient.books.$post({
      json: book,
    });
    return await response.json();
  }
};