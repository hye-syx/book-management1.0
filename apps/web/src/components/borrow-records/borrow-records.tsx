import type { RecordType } from '@repo/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { deleteRecordsMutation, listRecordsQuery } from '#/queries/record.query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function BorrowRecords() {
  const { data: records } = useQuery<RecordType.RecordRequest[]>({
    ...listRecordsQuery,
  });
  const queryClient = useQueryClient();
  // 删除记录
 const deleteRecordMutation = useMutation({
    ...deleteRecordsMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['records', 'all'] });
      toast.success("删除成功")
    },
  });
  const handleDelete = (id: number) => {
    deleteRecordMutation.mutate(id);
  };
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
            <TableHead>实际归还日期</TableHead>
            <TableHead>逾期天数</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>借阅数量</TableHead>
            <TableHead className='text-center'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records?.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.bookTitle}</TableCell>
              <TableCell>
                {dayjs.unix(record.borrowDate).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell>
                {dayjs.unix(record.returnDate).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell>
                {record.actualReturnDate
                  ? dayjs
                      .unix(record.actualReturnDate)
                      .format('YYYY-MM-DD HH:mm:ss')
                    : '未归还'}
              </TableCell>
              <TableCell>{record.overdueDays}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.borrowTotal}</TableCell>
              <TableCell className='text-center'>
                <Button>归还</Button>
                <Button 
                onClick={()=>{
                  if (confirm('确定删除吗？')){
                    handleDelete(record.id);
                  }
                }}
                
                >
                  删除
                </Button>
                <Button>编辑</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
