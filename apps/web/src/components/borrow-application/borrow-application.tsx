import {
  useQuery,
} from '@tanstack/react-query';
import dayjs from 'dayjs';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import { listApplicationQuery } from '#/queries/application.query';
import type { ApplicationType } from '@repo/types';

export function BorrowApplication() {
  const { data: applications } = useQuery<ApplicationType.Application[]>(listApplicationQuery);
  return (
    <div className='rounded-lg border border-gray-200 overflow-hidden'>
      <Table className='min-full'>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>申请人</TableHead>
            <TableHead>图书名称</TableHead>
            <TableHead>申请日期</TableHead>
            <TableHead>归还日期</TableHead>
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
                {dayjs.unix(application.borrowDate).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell>
                {dayjs.unix(application.returnDate).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell className='text-center'>
                <Button>
                  同意
                </Button>
                <Button>
                  拒绝  
                </Button>
                <Button>
                  取消申请
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}