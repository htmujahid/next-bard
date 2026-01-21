'use client';

import * as React from 'react';

import Link from 'next/link';

import { UserWithRole } from 'better-auth/plugins';
import {
  AppWindowIcon,
  BarChart3,
  Calendar,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  ListTodo,
  MessageSquare,
  SearchIcon,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';

import { SearchCommandDialog } from '@/components/misc/search-command-dialog';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavPrimary } from '@/components/sidebar/nav-primary';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { NavResources } from '../sidebar/nav-resources';
import { Button } from '../ui/button';

const data = {
  navTop: [
    {
      title: 'Dashboard',
      url: '/home',
      icon: LayoutDashboard,
    },
    {
      title: 'Tasks',
      url: '/home/tasks',
      icon: ListTodo,
    },
    {
      title: 'Projects',
      url: '/home/projects',
      icon: FolderKanban,
    },
    {
      title: 'Calendar',
      url: '/home/calendar',
      icon: Calendar,
    },
  ],
  navMain: [
    {
      title: 'Workspace',
      url: '#',
      icon: Sparkles,
      items: [
        {
          title: 'Documents',
          url: '/home/documents',
        },
        {
          title: 'Notes',
          url: '/home/notes',
        },
        {
          title: 'Files',
          url: '/home/files',
        },
      ],
    },
    {
      title: 'Team',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Members',
          url: '/home/team/members',
        },
        {
          title: 'Invitations',
          url: '/home/team/invitations',
        },
      ],
    },
    {
      title: 'Reports',
      url: '#',
      icon: BarChart3,
      items: [
        {
          title: 'Overview',
          url: '/home/reports',
        },
        {
          title: 'Analytics',
          url: '/home/reports/analytics',
        },
      ],
    },
  ],
  resources: [
    {
      title: 'Documentation',
      url: '/home/docs',
      icon: FileText,
    },
    {
      title: 'Feedback',
      url: '/home/feedback',
      icon: MessageSquare,
    },
    {
      title: 'Settings',
      url: '/home/settings',
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: 'Help',
      url: '/home/help',
      icon: LifeBuoy,
    },
  ],
};

export function UserSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: UserWithRole }) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Workspace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={data.navTop}>
          <SearchCommandDialog commandsData={data}>
            {({ open, setOpen }) => (
              <SidebarMenu>
                <SidebarMenuItem
                  className="flex items-center gap-2"
                  onClick={() => setOpen(!open)}
                >
                  <SidebarMenuButton
                    tooltip="Quick Search"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  >
                    <SearchIcon />
                    <span>Quick Search</span>
                  </SidebarMenuButton>
                  <Button
                    size="icon"
                    className="size-8 group-data-[collapsible=icon]:opacity-0"
                    variant="outline"
                  >
                    <AppWindowIcon />
                    <span className="sr-only">Site</span>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SearchCommandDialog>
        </NavPrimary>
        <NavMain items={data.navMain} />
        <NavResources resource="Resources" items={data.resources} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
