import { useForm } from '@tanstack/react-form';
import z from 'zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editRecordMutation, getRecordQuery } from '#/queries/record.query';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import type { UpdateRecordRequest } from '@repo/types/src/record/update-record.type';


const formSchema = z.object({
  bookTitle: z.string(),
  userName: z.string(),
  borrowDate: z.string().min(1, 'Borrow date is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  actualReturnDate:z.string(),
  overdueDays:z.number(),
  status:z.enum(['已归还', '借阅中','逾期']),
});

export function UpdateRecordForm({
  recordId,
  onOpenChange,
}: {
  recordId: number | null;
  onOpenChange: (open: boolean) => void;
}) {
   const {data : record } = useQuery({
    ...getRecordQuery(recordId!),
    enabled: !!recordId,
   });
   const queryClient = useQueryClient();
   const updateMutation = useMutation({
    ...editRecordMutation,
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ['records'],
      });
    },
  });


  const form = useForm({
    defaultValues: {
      bookTitle: '',
      userName: '',
      borrowDate: '',
      returnDate: '',
      actualReturnDate: '',
      overdueDays: 0,
      status: '借阅中',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
     const recordData = {
        id:recordId!,
        data:{
            ...value,
            bookId: record?.bookId ?? 0,
            userId: record?.userId ?? '',
            borrowDate: dayjs(value.borrowDate).unix(),
            returnDate: dayjs(value.returnDate).unix(),
            actualReturnDate: value.actualReturnDate ? dayjs(value.actualReturnDate).unix() : null,
            borrowTotal: record?.borrowTotal ?? 0,
            status: value.status as '借阅中' | '已归还' | '逾期',
        },
     }
     updateMutation.mutate(recordData);
    },
  })
   useEffect(()=>{
    if(!record) return;

    form.reset({
      userName: record.userName ?? '',
      bookTitle: record.bookTitle ?? '',
      borrowDate: dayjs.unix(record.borrowDate).format('YYYY-MM-DD') ?? '',
      returnDate: dayjs.unix(record.returnDate).format('YYYY-MM-DD') ?? '',
      actualReturnDate: record.actualReturnDate
        ? dayjs.unix(record.actualReturnDate).format('YYYY-MM-DD')
        : '',
      overdueDays: record.overdueDays ?? 0,
      status: record.status ?? '借阅中',
    });
   },[record,form])
  

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name='userName'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>用户名</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete='off'
                  readOnly
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='bookTitle'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>图书名称</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete='off'
                  readOnly
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='borrowDate'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>借阅日期</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type='date'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete='off'
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='returnDate'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>归还日期</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type='date'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete='off'
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='actualReturnDate'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>实际归还日期</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type='date'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete='off'
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='overdueDays'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>逾期天数</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                  placeholder='请输入逾期天数'
                  autoComplete='off'
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='status'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>状态</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.handleChange(value);
                    }
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='请选择借阅状态' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value='借阅中'>借阅中</SelectItem>
                    <SelectItem value='已归还'>已归还</SelectItem>
                    <SelectItem value='逾期'>逾期</SelectItem>
                  </SelectContent>
                </Select>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <div className='flex justify-end gap-2 mt-8'>
        <Button
          type='button'
          variant='outline'
          onClick={() => onOpenChange(false)}
        >
          取消
        </Button>
        <Button
          type='submit'
        >
          提交申请
        </Button>
      </div>
    </form>
  );
}
