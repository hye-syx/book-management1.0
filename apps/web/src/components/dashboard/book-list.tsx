import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteBookMutation, listBookQuery } from '#/queries/ book.query';
import { useMutation, useQuery ,useQueryClient} from '@tanstack/react-query';
import { Button } from '../ui/button';




export function TableDemo() {
  const queryClient = useQueryClient();
  //  删除图书
  const deleteMutation=useMutation({
    ...deleteBookMutation,
    onSuccess:() => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['books','all'] });
    }
  })
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  //  获取图书列表
   const { data: books } = useQuery({
    ...listBookQuery,
   });
  return (
    <div className='rounded-lg border border-gray-200 overflow-hidden'>
      <Table className='min-full'>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ISBN编码</TableHead>
            <TableHead>书名</TableHead>
            <TableHead>作者</TableHead>
            <TableHead>出版社</TableHead>
            <TableHead>出版时间</TableHead>
            <TableHead>图书类别</TableHead>
            <TableHead>价格</TableHead>
            <TableHead>总量</TableHead>
            <TableHead>可借数量</TableHead>
            <TableHead>借阅状态</TableHead>
            <TableHead>录入时间</TableHead>
            <TableHead className='text-center'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books?.map((book) => (
            <TableRow key={book.id}>
              <TableCell className='font-medium'>{book.isbn}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.publisher}</TableCell>
              <TableCell>{book.publicationDate}</TableCell>
              <TableCell>{book.categoryId}</TableCell>
              <TableCell>{book.price}</TableCell>
              <TableCell>{book.total}</TableCell>
              <TableCell>{book.available}</TableCell>
              <TableCell>{book.status}</TableCell>
              <TableCell>{book.createdAt}</TableCell>
              <TableCell className='text-center'>
                <Button>编辑</Button>
                <Button onClick={() => {
                  if (confirm('确定删除吗？')) {
                        handleDelete(book.id);
                      }}}>删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

