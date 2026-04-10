import type { UserType } from '@repo/types';
import dayjs from 'dayjs';
import { listUserQuery } from '#/queries/user.query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {useQuery} from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import { EditUserDialog } from './edit-user-dialog';

export function User() {
  // 获取全部图书
  const { data: users } = useQuery<UserType.User[]>({
    ...listUserQuery,
  });
  // 编辑图书
  const [editUserId, setEditUserId] = useState<string | ''>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
              <Button>删除</Button>
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

