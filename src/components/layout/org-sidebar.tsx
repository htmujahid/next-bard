'use client';

import * as React from 'react';

import Link from 'next/link';

import { UserWithRole } from 'better-auth/plugins';
import {
  Building2,
  HelpCircle,
  LayoutDashboard,
  Mail,
  Plus,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

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
import pathsConfig from '@/config/paths.config';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

interface OrgSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserWithRole;
  organization: Organization;
}

export function OrgSidebar({ user, organization, ...props }: OrgSidebarProps) {
  const navTop = [
    {
      title: 'Overview',
      url: pathsConfig.orgs.detail(organization.slug),
      icon: LayoutDashboard,
    },
    {
      title: 'Members',
      url: pathsConfig.orgs.members(organization.slug),
      icon: Users,
    },
    {
      title: 'Invitations',
      url: pathsConfig.orgs.invitations(organization.slug),
      icon: Mail,
    },
    {
      title: 'Roles',
      url: pathsConfig.orgs.roles(organization.slug),
      icon: Shield,
    },
    {
      title: 'Settings',
      url: pathsConfig.orgs.settings(organization.slug),
      icon: Settings,
    },
  ];

  const navSecondary = [
    {
      title: 'All Organizations',
      url: pathsConfig.orgs.root,
      icon: Building2,
    },
    {
      title: 'Create Organization',
      url: pathsConfig.orgs.create,
      icon: Plus,
    },
    {
      title: 'Help',
      url: '/help',
      icon: HelpCircle,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={pathsConfig.orgs.detail(organization.slug)}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {organization.logo ? (
                    <img
                      src={organization.logo}
                      alt={organization.name}
                      className="size-5 rounded"
                    />
                  ) : (
                    <Building2 className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {organization.name}
                  </span>
                  <span className="truncate text-xs">Organization</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navTop} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
