import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useId, useState } from 'react';
import { useListCategory } from '#/hooks/use-category';
import {
  getBookQuery,
  updateBookMutation,
} from '#/queries/book.query';
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

export function EditBookDialog({
  bookId,
  open,
  onOpenChange,
}: {
  bookId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data } = useQuery({
    ...getBookQuery(bookId!),
    enabled: open && bookId !== null,
  });
  const { data: categoryData } = useListCategory();
  const [bookData, setBookData] = useState<typeof data>(undefined);
  const formId = useId();
  const getFieldId = (fieldName: string) => `${formId}-${fieldName}`;

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    ...updateBookMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['books', 'all'],
      });
      onOpenChange(false);
    },
  });
  const handleSave = () => {
    if (bookData) {
      const { createdAt, updatedAt, ...reset } = bookData;
      const bookDataToSave = {
        ...reset,
      };
      updateMutation.mutate({
        id: bookId!,
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
                  value={
                    typeof bookData?.publicationDate === 'number'
                      ? dayjs
                          .unix(bookData.publicationDate)
                          .format('YYYY-MM-DD')
                      : bookData?.publicationDate
                  }
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    console.log('Input date:', dateValue);
                    // 使用 dayjs 转换为 unix 时间戳（秒）
                    const timestamp = dayjs(dateValue).unix();
                    console.log('Converted timestamp:', timestamp);
                    setBookData({
                      ...bookData,
                      publicationDate: timestamp,
                    });
                  }}
                />
              </Field>
              <Field>
                <Label htmlFor={getFieldId('category')}>图书类别</Label>
                <Select
                  value={bookData?.categoryId || ''}
                  onValueChange={(value) =>
                    setBookData({
                      ...bookData,
                      categoryId: value,
                    })
                  }
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue>
                      {categoryData?.find(
                        (category) => category.id === bookData?.categoryId,
                      )?.name || '请选择类别'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryData?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* <Input
                  id={getFieldId('category')}
                  name='category'
                  value={bookData?.categoryName}
                  onChange={(e) =>
                    setBookData({ ...bookData, categoryName: e.target.value })
                  }
                /> */}
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
                render={() => (
                  <Button variant='outline' onClick={() => onOpenChange(false)}>
                    取消
                  </Button>
                )}
              />
              <Button type='submit' onClick={handleSave}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}