import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BugReportForm } from './application-book-form';
import { Button } from '../ui/button';

export function ApplicationBookDialog({
  bookId,
  open,
  onOpenChange,
  userId,
  userName,
}: {
  bookId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | '';
  userName: string | '';
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>请填写申请信息</DialogTitle>
          <DialogDescription>填写借阅申请后提交审核。</DialogDescription>
          <DialogDescription>
            <BugReportForm
              bookId={bookId!}
              userName={userName}
              userId={userId}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type='submit' form='borrow-application-form'>
            提交申请
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
