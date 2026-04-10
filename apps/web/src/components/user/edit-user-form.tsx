import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import z from 'zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserQuery, updateUserMutation } from '#/queries/user.query';
import { useEffect} from 'react';

const formSchema = z.object({
 name: z.string().min(1, 'Name is required'),
 email: z.string().email('Email is required'),
 role: z.enum(['admin','librarian','reader']),
});

export function UpdateUserForm({
  userId,
  onOpenChange,

}: {
  userId: string;
  onOpenChange: (open: boolean) => void;
}) {
    // 获取单本图书信息
  const { data:user } = useQuery({
    ...getUserQuery(userId),
    enabled: !!userId,
  })
  const queryClient=useQueryClient();
  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  const form = useForm({
    defaultValues: {
      name:'',
      email: '',
      role:'reader',
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
      const userDate = {
        id: userId,
        user: {
          ...value,
          role: value.role as 'admin' | 'librarian' | 'reader',
        },
      };
      updateMutation.mutate(userDate);
    },
  })
  useEffect(() => {
    if (!user) return;
    form.reset({
      name: user.name ?? '',
      email: user.email ?? '',
      role: user.role ?? 'reader',
    });
  }, [user, form]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name='name'>
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
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name='email'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>邮箱</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
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
        <form.Field name='role'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>角色</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='请选择角色' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value='admin'>管理员</SelectItem>
                    <SelectItem value='librarian'>图书管理员</SelectItem>
                    <SelectItem value='reader'>读者</SelectItem>
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
          onClick={() => form.handleSubmit()}
        >
          提交申请
        </Button>
      </div>
    </form>
  );
}
