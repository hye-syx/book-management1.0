'use client';

import { ChevronRightIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '#/components/ui/sidebar';
import type { AppSidebarDataType } from './app-sidebar';
import { cn } from '#/lib/utils';
import { useState } from 'react';

export function NavMain({
  items,
}: {
  items: AppSidebarDataType['navMain'];
}) {
  return (
    <SidebarGroup>
      {items.map((item) => (
        <NavMainComponent key={item.title} items={item} />
      ))}

    </SidebarGroup>
  );
}

export type NavMainDataType = AppSidebarDataType['navMain'][number] & {
  isActive?: boolean;
};

export function NavMainComponent({ items }: { items: NavMainDataType }) {
  const [isOpen, setIsOpen] = useState(true);

  switch (items.type) {
    case 'single':
      return (
        <SidebarMenuItem>
          <SidebarMenuButton
            render={
              <a href={items.url}>
                {items.icon}
                <span>{items.title}</span>
              </a>
            }
            isActive={items.isActive}
          />
        </SidebarMenuItem>
      );
    case 'group':
      return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <SidebarMenuItem>
            <CollapsibleTrigger render={<SidebarMenuButton/>}>
             
                {items.icon}
                <span>{items.title}</span>
                <ChevronRightIcon
                  className={cn("ml-auto transition-transform", isOpen &&"rotate-90" )}
                />
            
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton render={<a href={subItem.url}>{subItem.title}</a>}/>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    default:
      return null;
  }
}
