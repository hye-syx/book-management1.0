import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { authClient } from '#/lib/auth-client';
import { deleteBookMutation, listBookQuery } from '#/queries/book.query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApplicationBookDialog } from '../borrow-application/application-book-dialog';
import { Button } from '../ui/button';
import { EditBookDialog } from './edit-book-dialog';

export function TableDemo() {
  // 获取点击编辑时图书的id
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [applicationDialogOpen,setApplicationDialogOpen]= useState(false);
  const [applicationBookId, setApplicationBookId] = useState<number | null>(
    null,
  );
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;
  const handleApplicationClose = (open: boolean, bookId?: number) => {
    setApplicationDialogOpen(open);
    if (bookId) {
      setApplicationBookId(bookId);
    }
  };
  const queryClient = useQueryClient();
  //  删除图书
  const deleteMutation = useMutation({
    ...deleteBookMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['books', 'all'] });
    },
  });
  const handleDelete = (id: number) => {
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
              <TableCell className='font-medium'>{book.books.isbn}</TableCell>
              <TableCell>{book.books.title}</TableCell>
              <TableCell>{book.books.author}</TableCell>
              <TableCell>{book.books.publisher}</TableCell>
              <TableCell>
                {dayjs.unix(book.books.publicationDate).format('YYYY-MM-DD')}
              </TableCell>
              <TableCell>{book.book_category.name}</TableCell>
              <TableCell>{book.books.price}</TableCell>
              <TableCell>{book.books.total}</TableCell>
              <TableCell>{book.books.available}</TableCell>
              <TableCell>{book.books.status}</TableCell>
              <TableCell>
                {dayjs.unix(book.books.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell className='text-center'>
                {
                  role!=='reader' && (
                    <>
                      <Button
                        onClick={() => {
                          setEditingBookId(book.books.id);
                          setEditDialogOpen(true);
                        }}
                      >
                        编辑
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm('确定删除吗？')) {
                            handleDelete(book.books.id);
                          }
                        }}
                      >
                        删除
                      </Button>
                    </>
                  )
                }

                <Button
                  onClick={() => {
                    // setApplicationBookId(book.books.id);
                    // setApplicationDialogOpen(true);
                    handleApplicationClose(true, book.books.id);
                  }}
                >
                  借阅
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditBookDialog
        bookId={editingBookId}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
        }}
        open={editDialogOpen}
      />
      <ApplicationBookDialog
        bookId={applicationBookId}
        onOpenChange={(open) => {
          setApplicationDialogOpen(open);
        }}
        open={applicationDialogOpen}
        userId={session?.user?.id || ''}
        userName={session?.user?.name || ''}
      />
    </div>
  );
}
