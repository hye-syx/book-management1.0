import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { listRenewalQuery } from '#/queries/renewal.query';
import { useQuery } from '@tanstack/react-query';
import { RenewalType } from '@repo/types';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function RenewalRecords() {
  const [keyword, setKeyword] = useState('');
  const { data: renewals } = useQuery<RenewalType.RenewalRequest[]>(listRenewalQuery(keyword));
  
 
  return (
    <>
       <div className='border-b bg-white px-6 pt-6 pb-5'>
              <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
                续借记录
              </h1>
              <p className='mt-1 text-sm text-gray-500'>搜索并查看续借信息</p>
      
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
              <TableHead className='w-[100px]'>申请人</TableHead>
              <TableHead>图书名称</TableHead>
              <TableHead>申请日期</TableHead>
              <TableHead>续借归还日期</TableHead>
              <TableHead>借阅数量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renewals?.map((renewal) => (
              <TableRow key={renewal.id}>
                <TableCell>{renewal.userName}</TableCell>
                <TableCell>{renewal.bookTitle}</TableCell>
                <TableCell>
                  {dayjs.unix(renewal.borrowDate).format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
                <TableCell>
                  {dayjs.unix(renewal.returnDate).format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
                <TableCell>{renewal.borrowTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
