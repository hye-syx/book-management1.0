import {
  BookOpenIcon,
  BotIcon,
  GalleryVerticalEndIcon,
  Settings2Icon,
  TerminalSquareIcon,
} from 'lucide-react';
import * as React from 'react';
import { NavMain } from '#/components/dashboard/nav-main';
import { NavUser } from '#/components/dashboard/nav-user';
import { TeamSwitcher } from '#/components/dashboard/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '#/components/ui/sidebar';
import { authClient, useSession } from '#/lib/auth-client';

// This is sample data.
export const AppSidebarData = {
  // user: {
   
  //   name: 'Admin',
  //   email: 'admin@example.com',
  //   avatar: '/avatars/shadcn.jpg',
  // },
  teams: [
    {
      name: '图书管理系统',
      logo: <GalleryVerticalEndIcon />,
      // plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: '图书管理',
      url: '/dashboard',
      icon: <TerminalSquareIcon />,
      type: 'single',
    },
    {
      title: '书籍录入',
      url: '/add-book',
      icon: <BotIcon />,
      type: 'single',
    },
    {
      title: '借阅申请',
      // url: '/borrow-application',
      icon: <BookOpenIcon />,
      type: 'group',
      items: [
        {
          title: '借阅申请',
          url: '/borrow-application',
        },
        {
          title: '借阅记录',
          url: '/borrow-records',
        },
      ],
    },
    {
      title: '系统设置',
      // url: '#',
      icon: <Settings2Icon />,
      type: 'group',
      items: [
        {
          title: '用户管理',
          url: '#',
        },
        {
          title: '角色管理',
          url: '#',
        },
        // {
        //   title: 'Billing',
        //   url: '#',
        // },
      ],
    },
  ],
  
};
export type AppSidebarDataType = typeof AppSidebarData;
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const {data: session} = authClient.useSession();
     console.log('session 👉', session); // 再看一次
   const userData={
    name: session?.user?.name || 'Admin',
    email: session?.user?.email || 'admin@example.com',
    avatar: session?.user?.image || '/avatars/shadcn.jpg',
   }
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={AppSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={AppSidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
