import * as React from 'react';

import Link from 'next/link';
import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';
import { Plus } from 'lucide-react';

import { SiteHeader } from '@/components/layout/site-header';
import { Footer } from '@/components/marketing/footer';
import { OrganizationsList } from '@/components/organization/organizations-list';
import { UserInvitationsList } from '@/components/organization/user-invitations-list';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import pathsConfig from '@/config/paths.config';
import { auth } from '@/lib/auth';
import { getSession } from '@/orpc/actions/auth/get-session';

async function getCachedUserInvitations(reqHeaders: Headers) {
  'use cache';
  cacheLife('hours');
  cacheTag('user-invitations');

  const invitations = await auth.api.listUserInvitations({
    headers: reqHeaders,
  });

  return invitations ?? [];
}

async function getCachedOrganizations(reqHeaders: Headers) {
  'use cache';
  cacheLife('hours');
  cacheTag('organizations');

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const organizations = await auth.api.listOrganizations({
    headers: reqHeaders,
  });

  return organizations ?? [];
}

export default async function OrganizationsPage() {
  const reqHeaders = await headers();
  const session = await getSession(reqHeaders);

  const organizationsPromise = getCachedOrganizations(reqHeaders);
  const invitationsPromise = getCachedUserInvitations(reqHeaders);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader session={session?.session ?? null} user={session?.user ?? null} />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Organizations
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your organizations and team collaborations.
              </p>
            </div>
            <Button asChild>
              <Link href={pathsConfig.orgs.create}>
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </Link>
            </Button>
          </div>

          <React.Suspense
            fallback={
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }
          >
            <UserInvitationsList promises={invitationsPromise} />
          </React.Suspense>

          <React.Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-9 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <OrganizationsList promises={organizationsPromise} />
          </React.Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
