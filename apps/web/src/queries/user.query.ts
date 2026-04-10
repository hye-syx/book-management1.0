import { apiClient } from "#/lib/api-client";
import type { UpdateUserRequest } from "@repo/types/src/user/update-user.type";

export const listUserQuery ={
    queryKey: ['user','all'],
    queryFn: async () => {
     const response = await apiClient.user.$get();
     if (!response.ok) {
      throw new Error('Failed to fetch users');
     }
     return await response.json();
    },

};
export const getUserQuery = (userId: string) => ({
    queryKey: ['user', userId],
    queryFn: async () => {
     const response = await apiClient.user[':id'].$get({
        param: { id: userId },
     });
     if (!response.ok) {
      throw new Error('Failed to fetch user');
     }
     return await response.json();
    },
});
// 修改图书
export const updateUserMutation = {
  mutationKey: ['user', 'update'],
  mutationFn: async ({ id, user }: { id: string; user: UpdateUserRequest }) => {
    const response = await apiClient.user[':id'].$put({
      param: { id },
      json: user,
    });
    return await response.json();
  },
};
// 删除图书
export const deleteUserMutation={
  mutationKey:['user','delete'],
  mutationFn: async (id: string) => {
    const response = await apiClient.user[':id'].$delete({
      param: { id },
    });
    return await response.json();
  },
}

