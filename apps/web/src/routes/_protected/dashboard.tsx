import { Separator } from '@base-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { AppSidebar } from '#/components/dashboard/app-sidebar';
import { TableDemo } from '#/components/dashboard/book-list';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar';

export const Route = createFileRoute('/_protected/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return <TableDemo />;
}
