'use client';

import * as React from 'react';

import { UserWithRole } from 'better-auth/plugins';
import {
  HelpCircle,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  Users,
  UsersRound,
} from 'lucide-react';

import { OrgSwitcher } from '@/components/organization/org-switcher';
import { NavPrimary } from '@/components/sidebar/nav-primary';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
  organizations: Organization[];
}

export function OrgSidebar({ user, organization, organizations, ...props }: OrgSidebarProps) {
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
      title: 'Teams',
      url: pathsConfig.orgs.teams(organization.slug),
      icon: UsersRound,
    },
    {
      title: 'Settings',
      url: pathsConfig.orgs.settings(organization.slug),
      icon: Settings,
    },
  ];

  const navSecondary = [
    {
      title: 'Help',
      url: '/help',
      icon: HelpCircle,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <OrgSwitcher organization={organization} organizations={organizations} />
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
