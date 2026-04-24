import { createFileRoute } from '@tanstack/react-router';
import { BorrowApplication } from '#/components/borrow-application/borrow-application';
import { BorrowRecords } from '#/components/borrow-records/borrow-records';
import { AppSidebar } from '#/components/dashboard/app-sidebar';
import { Separator } from '#/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar';

export const Route = createFileRoute('/_protected/borrow-records')({
  component: borrowRecordsPage,
});

function borrowRecordsPage() {
  return <BorrowRecords />;
}
