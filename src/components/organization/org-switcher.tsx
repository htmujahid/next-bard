'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Building2, ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import pathsConfig from '@/config/paths.config';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

interface OrgSwitcherProps {
  organization: Organization;
  organizations: Organization[];
}

export function OrgSwitcher({ organization, organizations }: OrgSwitcherProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSwitchOrganization = (org: Organization) => {
    router.push(pathsConfig.orgs.detail(org.slug));
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
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
                <span className="truncate font-medium">{organization.name}</span>
                <span className="truncate text-xs">Organization</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSwitchOrganization(org)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="size-4 rounded"
                    />
                  ) : (
                    <Building2 className="size-3.5 shrink-0" />
                  )}
                </div>
                <span className="truncate">{org.name}</span>
                {org.id === organization.id && (
                  <span className="bg-primary ml-auto size-2 rounded-full" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link href={pathsConfig.orgs.create}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <span className="text-muted-foreground font-medium">
                  Create organization
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
