import { apiClient } from '@/lib/api-client';
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
