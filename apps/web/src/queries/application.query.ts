import { apiClient } from "#/lib/api-client";

export const listApplicationQuery = {
  queryKey: ['applications', 'all'],
  // queryFn: async () => {
  //     const response = await fetch('/api/books');
  //     return response.json();
  // }
  queryFn: async () => {
    const response = await apiClient.applications.$get();
    return await response.json();
  },
};