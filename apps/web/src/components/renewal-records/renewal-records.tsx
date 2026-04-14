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

export function RenewalRecords() {
  const { data: renewals } = useQuery(listRenewalQuery);
  
 
  return (
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
            <TableHead className='text-center'>操作</TableHead>
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
              <TableCell className='text-center'>
               
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
