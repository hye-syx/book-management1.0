import type { ApplicationType } from '@repo/types';
import type { ApplicationReviewRequest } from '@repo/types/src/application/ApplicationReview.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  listApplicationQuery,
  reviewApplicationMutation,
} from '#/queries/application.query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import { authClient } from '#/lib/auth-client';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useState } from 'react';

export function BorrowApplication() {
  const [keyword, setKeyword] = useState('');
  const { data: applications } = useQuery<ApplicationType.Application[]>({
    ...listApplicationQuery(keyword),
  });
  const { data: session } = authClient.useSession();
    const role = session?.user?.role;
  // 审批
  const queryClient = useQueryClient();
  const reviewMutation = useMutation({
    ...reviewApplicationMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['applications', 'all'] });
      toast.success('操作成功');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handelReview = (
    id: number,
    status: ApplicationReviewRequest['status'],
  ) => {
    reviewMutation.mutate({ id, status });
  };
  return (
    <>
      <div className='border-b bg-white px-6 pt-6 pb-5'>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
                借阅申请
          </h1>
              <p className='mt-1 text-sm text-gray-500'>搜索并查看借阅申请信息</p>
      
              <div className='mt-5 relative w-full'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='搜索申请人/书名'
                  className='h-9 w-full rounded-md border-gray-200 bg-white pl-9 pr-3 text-sm shadow-none'
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
      <div className='rounded-lg border border-gray-200 overflow-hidden'>
        <Table className='min-full'>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>申请人</TableHead>
              <TableHead>图书名称</TableHead>
              <TableHead>申请日期</TableHead>
              <TableHead>归还日期</TableHead>
              <TableHead>借阅数量</TableHead>
              <TableHead>审核状态</TableHead>
              <TableHead className='text-center'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications?.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.userName}</TableCell>
                <TableCell>{application.bookTitle}</TableCell>
                <TableCell>
                  {dayjs
                    .unix(application.borrowDate)
                    .format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
                <TableCell>
                  {dayjs
                    .unix(application.returnDate)
                    .format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
                <TableCell>{application.borrowTotal}</TableCell>
                <TableCell>{application.status}</TableCell>
                <TableCell className='text-center'>
                  {role !== 'reader' && (
                    <>
                      <Button
                        disabled={application.status !== '待审核'}
                        onClick={() => {
                          handelReview(application.id, '已批准');
                        }}
                      >
                        同意
                      </Button>
                      <Button
                        disabled={application.status !== '待审核'}
                        onClick={() => {
                          handelReview(application.id, '已拒绝');
                        }}
                      >
                        拒绝
                      </Button>
                    </>
                  )}
                  <Button
                    disabled={application.status !== '待审核'}
                    onClick={() => {
                      handelReview(application.id, '已取消');
                    }}
                  >
                    取消申请
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
