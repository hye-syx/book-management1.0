import {
  dataTagErrorSymbol,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useId, useState } from 'react';
import dayjs from 'dayjs';
import {
  deleteBookMutation,
  getBookQuery,
  listBookQuery,
  updateBookMutation,
} from '#/queries/ book.query';
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
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Field, FieldGroup } from '../ui/field';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function TableDemo() {
  // 获取点击编辑时图书的id
  const [editingBookId, setEditingBookId] = useState<string>('');
  const queryClient = useQueryClient();
  //  删除图书
  const deleteMutation = useMutation({
    ...deleteBookMutation,
    onSuccess: () => {
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['books', 'all'] });
    },
  });
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
              <TableCell>{dayjs.unix(book.publicationDate).format('YYYY-MM-DD')}</TableCell>
              <TableCell>{book.categoryId}</TableCell>
              <TableCell>{book.price}</TableCell>
              <TableCell>{book.total}</TableCell>
              <TableCell>{book.available}</TableCell>
              <TableCell>{book.status}</TableCell>
              <TableCell>{dayjs.unix(book.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
              <TableCell className='text-center'>
                <Button
                  onClick={() => {
                    setEditingBookId(book.id);
                  }}
                >
                  编辑
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('确定删除吗？')) {
                      handleDelete(book.id);
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
      <EditBookDialog
        bookId={editingBookId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBookId('');
          }
        }}
        open={editingBookId !== ''}
      />
    </div>
  );
}

function EditBookDialog({
  bookId,
  open,
  onOpenChange,
}: {
  bookId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data } = useQuery({
    ...getBookQuery(bookId),
    enabled: open && bookId !== '',
  });
  const [bookData, setBookData] = useState<typeof data>(undefined);
  const formId = useId();
  const getFieldId = (fieldName: string) => `${formId}-${fieldName}`;
 
 
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    ...updateBookMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['books','all'],
      });
      onOpenChange(false);
    },
  });
  const handleSave = () => {
    if (bookData) {
      const { createdAt, updatedAt, publicationDate, ...reset } = bookData;
      const publicationDateTimestamp = dayjs(publicationDate).unix();
      const bookDataToSave = {
        ...reset,
        publicationDate: publicationDateTimestamp,
      }
      updateMutation.mutate({
        id: bookId,
        book: bookDataToSave,
      });
    }
  };
  useEffect(() => {
    if (data) {
      setBookData(data);
    }
  }, [data]);

  if (!bookData) {
    return null;
  }


  return (
    <>
      {/* 编辑图书弹窗 */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <form onSubmit={(e) => e.preventDefault()}>
          <DialogTrigger />
          <DialogContent className='sm:max-w-xl'>
            <DialogHeader>
              <DialogTitle>修改图书</DialogTitle>
              <DialogDescription>修改图书信息</DialogDescription>
            </DialogHeader>
            <FieldGroup className='grid grid-cols-2 gap-4'>
              <Field>
                <Label htmlFor={getFieldId('title')}>书名</Label>
                <Input
                  id={getFieldId('title')}
                  name='title'
                  value={bookData?.title || ''}
                  onChange={(e) =>
                    setBookData({ ...bookData, title: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('author')}>作者</Label>
                <Input
                  id={getFieldId('author')}
                  name='author'
                  value={bookData?.author}
                  onChange={(e) =>
                    setBookData({ ...bookData, author: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('publisher')}>出版社</Label>
                <Input
                  id={getFieldId('publisher')}
                  name='publisher'
                  value={bookData?.publisher}
                  onChange={(e) =>
                    setBookData({ ...bookData, publisher: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('publishDate')}>出版日期</Label>
                <Input
                  id={getFieldId('publishDate')}
                  name='publishDate'
                  type='date'
                  value={typeof bookData?.publicationDate === 'number' ? dayjs.unix(bookData.publicationDate).format('YYYY-MM-DD') : bookData?.publicationDate}
                  onChange={(e) =>
                    setBookData({
                      ...bookData,
                      publicationDate: Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('category')}>图书类别</Label>
                <Input
                  id={getFieldId('category')}
                  name='category'
                  value={bookData?.categoryId}
                  onChange={(e) =>
                    setBookData({ ...bookData, categoryId: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('price')}>价格</Label>
                <Input
                  id={getFieldId('price')}
                  name='price'
                  value={bookData?.price}
                  onChange={(e) =>
                    setBookData({ ...bookData, price: Number(e.target.value) })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('total')}>总量</Label>
                <Input
                  id={getFieldId('total')}
                  name='total'
                  value={bookData?.total}
                  onChange={(e) =>
                    setBookData({ ...bookData, total: Number(e.target.value) })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('available')}>可借数量</Label>
                <Input
                  id={getFieldId('available')}
                  name='available'
                  value={bookData?.available}
                  onChange={(e) =>
                    setBookData({
                      ...bookData,
                      available: Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field className='col-span-2'>
                <Label htmlFor={getFieldId('status')}>借阅状态</Label>
                <Select
                  value={bookData?.status || ''}
                  onValueChange={(value) =>
                    setBookData({
                      ...bookData,
                      status: value as '在馆' | '借出' | '遗失' | '损坏',
                    })
                  }
                >
                  <SelectTrigger id={getFieldId('status')} className='w-full'>
                    <SelectValue placeholder='请选择借阅状态' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>借阅状态</SelectLabel>

                      <SelectItem value='在馆'>在馆</SelectItem>
                      <SelectItem value='借出'>借出</SelectItem>
                      <SelectItem value='遗失'>遗失</SelectItem>
                      <SelectItem value='损坏'>损坏</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose
                render={() => <Button variant='outline' onClick={() => onOpenChange(false)}>取消</Button>}
              />
              <Button type='submit' onClick={handleSave} >保存</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
