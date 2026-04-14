import type { UserType } from '@repo/types';
import dayjs from 'dayjs';
import { deleteUserMutation, listUserQuery } from '#/queries/user.query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import { EditUserDialog } from './edit-user-dialog';
import { toast } from 'sonner';

export function User() {
  // 获取全部图书
  const { data: users } = useQuery<UserType.User[]>({
    ...listUserQuery,
  });
  const [editUserId, setEditUserId] = useState<string | ''>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  // 删除图书
  const deleteMutation = useMutation({
    ...deleteUserMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] });
      toast.success('删除成功')
    },
  });
  return (
    <div className='rounded-lg border border-gray-200 overflow-hidden'>
      <Table className='min-full'>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>用户名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>注册时间</TableHead>
            <TableHead>修改时间</TableHead>
            <TableHead className='text-center'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell>
                {dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>

              <TableCell className='text-center'>
              <Button onClick={() => {
                setEditUserId(user.id);
                setEditDialogOpen(true);
              }}>编辑</Button>
              <Button onClick={() => {
                if(confirm('确定删除吗？')) {
                  deleteMutation.mutate(user.id);
                }
              }}
              
              >删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditUserDialog
        userId={editUserId}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
        }}
      />
    </div>
  );
}

