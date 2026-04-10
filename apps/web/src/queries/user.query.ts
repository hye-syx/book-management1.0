import { apiClient } from "#/lib/api-client";

export const listUserQuery ={
    queryKey: ['user','all'],
    queryFn: async () => {
     const response = await apiClient.user.$get();
     return await response.json();
    },
  };

