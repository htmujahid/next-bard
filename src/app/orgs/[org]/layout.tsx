import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';
import { UserWithRole } from 'better-auth/plugins';

import { AppBreadcrumbs } from '@/components/layout/app-breadcrumb';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { OrgSidebar } from '@/components/layout/org-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import pathsConfig from '@/config/paths.config';
import { auth } from '@/lib/auth';
import { getSession } from '@/orpc/actions/auth/get-session';

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ org: string }>;
}

async function getCachedOrganization(reqHeaders: Headers, slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`organization-${slug}`);

  const organization = await auth.api.getFullOrganization({
    headers: reqHeaders,
    query: {
      organizationSlug: slug,
    },
  });

  return organization;
}

async function getCachedOrganizations(reqHeaders: Headers) {
  'use cache';
  cacheLife('hours');
  cacheTag('organizations');

  const organizations = await auth.api.listOrganizations({
    headers: reqHeaders,
  });

  return organizations ?? [];
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();
  const session = await getSession(reqHeaders);

  if (!session) {
    redirect(pathsConfig.auth.signIn);
  }

  const [organization, organizations] = await Promise.all([
    getCachedOrganization(reqHeaders, slug),
    getCachedOrganizations(reqHeaders),
  ]);

  if (!organization) {
    notFound();
  }

  // Set the active organization for this session
  await auth.api.setActiveOrganization({
    headers: reqHeaders,
    body: {
      organizationId: organization.id,
    },
  });

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <OrgSidebar
        user={session.user as UserWithRole}
        organization={{
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
        }}
        organizations={organizations.map((org) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo: org.logo,
        }))}
      />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4">
            <SidebarTrigger className="" />
            <AppBreadcrumbs />
            <div className="ml-auto flex items-center gap-2">
              <NotificationDropdown />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
