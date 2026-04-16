import { apiClient } from "#/lib/api-client";
import { throwApiError } from "#/lib/api-error";
import type { UpdateUserRequest } from "@repo/types/src/user/update-user.type";

export const listUserQuery ={
    queryKey: ['user','all'],
    queryFn: async () => {
     const response = await apiClient.user.$get();
    if (!response.ok) {
      return throwApiError(response, '获取用户列表失败');
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
      return throwApiError(response, '获取用户失败');
    }

    return await response.json();
    },
});
// 修改
export const updateUserMutation = {
  mutationKey: ['user', 'update'],
  mutationFn: async ({ id, user }: { id: string; user: UpdateUserRequest }) => {
    const response = await apiClient.user[':id'].$put({
      param: { id },
      json: user,
    });
    if (!response.ok) {
      return throwApiError(response, '更新用户失败');
    }

    return await response.json();
  },
};
// 删除用户
export const deleteUserMutation={
  mutationKey:['user','delete'],
  mutationFn: async (id: string) => {
    const response = await apiClient.user[':id'].$delete({
      param: { id },
    });
    if (!response.ok) {
      return throwApiError(response, '删除用户失败');
    }

    return await response.json();
  },
}
