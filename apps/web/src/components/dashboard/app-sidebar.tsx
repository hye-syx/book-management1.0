import {
  AudioLinesIcon,
  BookOpenIcon,
  BotIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  TerminalIcon,
  TerminalSquareIcon,
} from 'lucide-react';
import * as React from 'react';
import { NavMain } from '#/components/dashboard/nav-main';
import { NavProjects } from '#/components/dashboard/nav-projects';
import { NavUser } from '#/components/dashboard/nav-user';
import { TeamSwitcher } from '#/components/dashboard/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '#/components/ui/sidebar';

// This is sample data.
export const AppSidebarData = {
  user: {
   
    name: 'Admin',
    email: 'admin@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
      url: '#',
      icon: <TerminalSquareIcon />,
      type: 'single',
    },
    {
      title: '书籍录入',
      url: '#',
      icon: <BotIcon />,
      type: 'single',
    },
    {
      title: '借阅申请',
      url: '#',
      icon: <BookOpenIcon />,
      type: 'single',
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
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={AppSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={AppSidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={AppSidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
