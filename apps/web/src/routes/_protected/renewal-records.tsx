import { createFileRoute } from '@tanstack/react-router';
import { AppSidebar } from '#/components/dashboard/app-sidebar';
import { RenewalRecords } from '#/components/renewal-records/renewal-records';
import { Separator } from '#/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar';

export const Route = createFileRoute('/_protected/renewal-records')({
  component: renewalRecordsPage,
});

function renewalRecordsPage() {
  return <RenewalRecords />;
}
