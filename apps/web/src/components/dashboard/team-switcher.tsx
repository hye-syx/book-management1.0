import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ReactNode
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  if (!activeTeam) {
    return null
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem className='cursor-pointer'>
        {/* <SidebarMenuButton
          size='lg'
          className='data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground'
        > */}
        <div className='flex items-center gap-2'>
          <div
            className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground [&_svg]:size-4
  [&_svg]:shrink-0'
          >
            {activeTeam.logo}
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-medium'>{activeTeam.name}</span>
            {/* <span className='truncate text-xs'>{activeTeam.plan}</span> */}
          </div>
        </div>
        {/* </SidebarMenuButton> */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
