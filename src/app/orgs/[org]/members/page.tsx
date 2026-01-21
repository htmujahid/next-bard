import * as React from 'react';

import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';

import { Shell } from '@/components/layout/shell';
import { MembersTable } from '@/components/organization/members-table';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';

interface MembersPageProps {
  params: Promise<{ org: string }>;
}

async function getCachedOrganization(reqHeaders: Headers, slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`organization-${slug}`);

  return await auth.api.getFullOrganization({
    headers: reqHeaders,
    query: {
      organizationSlug: slug,
    },
  });
}

async function getCachedMembers(reqHeaders: Headers, organizationId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`organization-members-${organizationId}`);

  const [membersRes, activeMemberRes] = await Promise.all([
    auth.api.listMembers({
      headers: reqHeaders,
      query: { organizationId },
    }),
    auth.api.getActiveMember({
      headers: reqHeaders,
    }),
  ]);

  return {
    members: (membersRes?.members ?? []) as Array<{
      id: string;
      role: string;
      createdAt: Date;
      user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
    }>,
    activeMember: activeMemberRes as { id: string; role: string } | null,
  };
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();

  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    return null;
  }

  const membersPromise = getCachedMembers(reqHeaders, organization.id);

  return (
    <Shell>
      <React.Suspense
        fallback={
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex items-center justify-between p-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="overflow-hidden rounded-md border">
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <MembersTable
          promises={membersPromise}
          organizationId={organization.id}
          orgSlug={slug}
        />
      </React.Suspense>
    </Shell>
  );
}
