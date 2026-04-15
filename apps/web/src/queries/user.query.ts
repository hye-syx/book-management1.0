import { apiClient } from "#/lib/api-client";
import type { UpdateUserRequest } from "@repo/types/src/user/update-user.type";

export const listUserQuery ={
    queryKey: ['user','all'],
    queryFn: async () => {
     const response = await apiClient.user.$get();
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '获取用户列表失败';
      throw new Error(message);
    }

    return data;
    },

};
export const getUserQuery = (userId: string) => ({
    queryKey: ['user', userId],
    queryFn: async () => {
     const response = await apiClient.user[':id'].$get({
      param: { id: userId },
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '获取用户失败';
      throw new Error(message);
    }

    return data;
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
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '更新用户失败';
      throw new Error(message);
    }

    return data;
  },
};
// 删除用户
export const deleteUserMutation={
  mutationKey:['user','delete'],
  mutationFn: async (id: string) => {
    const response = await apiClient.user[':id'].$delete({
      param: { id },
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? data.message
          : '删除用户失败';
      throw new Error(message);
    }

    return data;
  },
}

