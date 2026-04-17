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
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

export function User() {
  // 获取全部图书
  const [keyword,setKeyword] = useState('');
  const { data: users } = useQuery<UserType.User[]>({
    ...listUserQuery(keyword),
  });
  const [editUserId, setEditUserId] = useState<string | ''>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  // 删除
  const deleteMutation = useMutation({
    ...deleteUserMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] });
      toast.success('删除成功')
    },
     onError: (error) => {
      toast.error(error.message)
    }
  });
  return (
    <>
     <div className='border-b bg-white px-6 pt-6 pb-5'>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              用户管理
            </h1>
            <p className='mt-1 text-sm text-gray-500'>搜索并查看用户信息</p>
    
            <div className='mt-5 relative w-full'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='搜索书名 / 作者 / ISBN'
                className='h-9 w-full rounded-md border-gray-200 bg-white pl-9 pr-3 text-sm shadow-none'
              />
            </div>
          </div>
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
                  <Button
                    onClick={() => {
                      setEditUserId(user.id);
                      setEditDialogOpen(true);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm('确定删除吗？')) {
                        deleteMutation.mutate(user.id);
                      }
                    }}
                  >
                    删除
                  </Button>
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
    </>
  );
}

