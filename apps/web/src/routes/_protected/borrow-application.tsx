import { createFileRoute } from '@tanstack/react-router';
import { BorrowApplication } from '#/components/borrow-application/borrow-application';
import { AppSidebar } from '#/components/dashboard/app-sidebar';
import { Separator } from '#/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar';

export const Route = createFileRoute('/_protected/borrow-application')({
  component: borrowApplicationPage,
});

function borrowApplicationPage() {
  return <BorrowApplication />;
}
