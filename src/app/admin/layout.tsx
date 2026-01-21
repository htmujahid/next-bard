import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { UserWithRole } from 'better-auth/plugins';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AppBreadcrumbs } from '@/components/layout/app-breadcrumb';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import pathsConfig from '@/config/paths.config';
import { getSession } from '@/orpc/actions/auth/get-session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(await headers());

  if (!session?.user?.role?.split(',').includes('admin')) {
    redirect(pathsConfig.auth.signIn);
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AdminSidebar user={session?.user as UserWithRole} />
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
