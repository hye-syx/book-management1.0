import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { deleteRecordsMutation, listRecordsQuery, returnBookMutation } from '#/queries/record.query';
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
import { useState } from 'react';
import { EditRecordDialog } from './edit-record-dialog';
import { addRenewalMutation } from '#/queries/renewal.query';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';


export function BorrowRecords() {
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { data: records } = useQuery(listRecordsQuery(keyword));
  const queryClient = useQueryClient();
  // 删除记录
const deleteRecordMutation = useMutation({
  ...deleteRecordsMutation,
  onSuccess: () => {
    // 刷新列表
    queryClient.invalidateQueries({ queryKey: ['records', 'all'] });
    toast.success('删除成功');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
  const handleDelete = (id: number) => {
    deleteRecordMutation.mutate(id);
  };
  const returnMutation = useMutation({
    ...returnBookMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['records', 'all'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const addMutation = useMutation({
    ...addRenewalMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['records', 'all'] });
      toast.success("续借成功") 
    },
    onError: (error) => {
      toast.error(error.message)
    }
  });
  // 
  return (
    <>
     <div className='border-b bg-white px-6 pt-6 pb-5'>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              借阅记录管理
            </h1>
            <p className='mt-1 text-sm text-gray-500'>搜索并查看借阅记录</p>
    
            <div className='mt-5 relative w-full'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='搜索书名 / 申请人'
                className='h-9 w-full rounded-md border-gray-200 bg-white pl-9 pr-3 text-sm shadow-none'
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
                <Button
                 onClick={()=>{
                  // 调用归还接口
                  returnMutation.mutate(record.id);
                 }}
                
                >归还</Button>
                <Button
                  onClick={()=>{
                    // 调用续借接口
                    addMutation.mutate(record.id);
                  }}
                
                >续借</Button>
                <Button 
                onClick={()=>{
                  if (confirm('确定删除吗？')){
                    handleDelete(record.id);
                  }
                }} 
                >
                  删除
                </Button>
                <Button onClick={()=>{
                  setSelectedRecordId(record.id);
                  setRecordDialogOpen(true);
                }}>编辑</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditRecordDialog
        recordId={selectedRecordId}
        open={recordDialogOpen}
        onOpenChange={(open) => {
          setRecordDialogOpen(open);
        }}
      />
    </div>
    </>
  );
}
