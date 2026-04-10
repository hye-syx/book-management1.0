import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import z from 'zod';
import { addApplicationMutation } from '#/queries/application.query';
import { getBookQuery } from '#/queries/book.query';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  bookId: z.number().min(1, 'Book ID is required'),
  userName: z.string().min(1, 'User name is required'),
  bookTitle: z.string().min(1, 'Book title is required'),
  borrowDate: z.string().min(1, 'Borrow date is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  borrowTotal: z.number().min(1, 'Borrow total is required'),
});

export function BugReportForm({
  bookId,
  userId,
  userName,
  onOpenChange,
}: {
  bookId: number;
  userId: string;
  userName: string;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: books } = useQuery({
    ...getBookQuery(bookId),
  });
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    ...addApplicationMutation,
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ['books'],
      });
    },
  });
  const form = useForm({
    defaultValues: {
      userId: userId,
      bookId: bookId,
      userName: userName,
      bookTitle: books?.title || '',
      borrowTotal: 0,
      borrowDate: '',
      returnDate: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast('You submitted the following values:', {
        description: (
          <pre className='mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground'>
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
        } as React.CSSProperties,
      });
      const applicationData = {
        userId: value.userId,
        bookId: value.bookId,
        borrowTotal: value.borrowTotal,
        borrowDate: dayjs(value.borrowDate).unix(),
        returnDate: dayjs(value.returnDate).unix(),
        status: '待审核' as const,
      };
      console.log('applicationData', applicationData);
      addMutation.mutate(applicationData);
    },
  });

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
                <FieldLabel htmlFor={field.name}>申请人</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  readOnly
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete='off'
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
                  readOnly
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete='off'
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='borrowTotal'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>借阅数量</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                  autoComplete='off'
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
                <FieldLabel htmlFor={field.name}>申请日期</FieldLabel>

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
          onClick={() => form.handleSubmit()}
        >
          提交申请
        </Button>
      </div>
    </form>
  );
}
