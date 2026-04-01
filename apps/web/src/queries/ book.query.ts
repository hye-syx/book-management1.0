import { apiClient } from '@/lib/api-client';

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
