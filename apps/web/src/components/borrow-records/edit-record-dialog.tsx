import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { UpdateRecordForm } from './edit-record-form';

export function EditRecordDialog({
  recordId,
  open,
  onOpenChange,
}: {
  recordId:number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑借阅记录</DialogTitle>
          <DialogDescription>填写后提交</DialogDescription>
        </DialogHeader>
        <UpdateRecordForm 
         recordId={recordId}
         onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
