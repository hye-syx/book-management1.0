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


export const AppSidebarData = {
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
      roles: ['admin', 'librarian', 'reader'],
    },
    {
      title: '书籍录入',
      url: '/add-book',
      icon: <BotIcon />,
      type: 'single',
      roles: ['admin', 'librarian'],
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
          roles: ['admin', 'librarian', 'reader'],
        },
        {
          title: '借阅记录',
          url: '/borrow-records',
          roles: ['admin', 'librarian', 'reader'],
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
          url: '/user',
          roles: ['admin'],
        },
      ],
    },
  ],
};
export type AppSidebarDataType = typeof AppSidebarData;
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const {data: session} = authClient.useSession();
   const userData={
    name: session?.user?.name || 'Admin',
    email: session?.user?.email || 'admin@example.com',
    avatar: session?.user?.image || '/avatars/shadcn.jpg',
   }
   const role=session?.user?.role || 'reader'
   const visibleNavMain = AppSidebarData.navMain.map((item) => {
       if(item.type === 'single'){
        return item.roles?.includes(role) ? item : null
       }
       const visibleItems = item.items?.filter((subItem) =>
        subItem.roles.includes(role),
      );
      if (!visibleItems?.length) {
        return null;
      }
       return {
        title: item.title,
        icon: item.icon,
        type: item.type,
        items: visibleItems,
      };
   }).filter((item) => item !== null)
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={AppSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
