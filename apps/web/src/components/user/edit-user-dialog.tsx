import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { UpdateUserForm } from './edit-user-form';
export function EditUserDialog({
  userId,
  open,
  onOpenChange,
}: {
  userId: string | '';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑用户信息</DialogTitle>
          <DialogDescription>填写后提交</DialogDescription>
        </DialogHeader>
        <UpdateUserForm
          userId={userId}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
