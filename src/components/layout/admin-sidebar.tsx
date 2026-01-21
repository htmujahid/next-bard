'use client';

import * as React from 'react';

import Link from 'next/link';

import { UserWithRole } from 'better-auth/plugins';
import {
  Activity,
  Building2,
  HelpCircle,
  Key,
  LayoutDashboard,
  Lock,
  Plug,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  Users,
  Webhook,
} from 'lucide-react';

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

const data = {
  navTop: [
    {
      title: 'Overview',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: Users,
    },
    {
      title: 'Organizations',
      url: '/admin/organizations',
      icon: Building2,
    },
    {
      title: 'Roles & Permissions',
      url: '/admin/roles',
      icon: Shield,
    },
  ],
  navMain: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
      items: [
        {
          title: 'General',
          url: '/admin/settings',
        },
        {
          title: 'Security',
          url: '/admin/settings/security',
        },
        {
          title: 'Authentication',
          url: '/admin/settings/auth',
        },
      ],
    },
    {
      title: 'Security',
      url: '#',
      icon: Lock,
      items: [
        {
          title: 'Sessions',
          url: '/admin/security/sessions',
        },
        {
          title: 'Login History',
          url: '/admin/security/login-history',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Help Center',
      url: '/admin/help',
      icon: HelpCircle,
    },
  ],
  developer: [
    {
      title: 'API Keys',
      url: '/admin/api-keys',
      icon: Key,
    },
    {
      title: 'Webhooks',
      url: '/admin/webhooks',
      icon: Webhook,
    },
    {
      title: 'Integrations',
      url: '/admin/integrations',
      icon: Plug,
    },
    {
      title: 'Audit Logs',
      url: '/admin/audit-logs',
      icon: ScrollText,
    },
    {
      title: 'System Status',
      url: '/admin/status',
      icon: Activity,
    },
  ],
};

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: UserWithRole }) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <Sparkles className="!size-5" />
                <span className="text-base font-semibold">Acme Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={data.navTop} />
        <NavMain items={data.navMain} />
        <NavResources resource="Developer" items={data.developer} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
