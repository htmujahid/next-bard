import * as React from 'react';

import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';

import { Shell } from '@/components/layout/shell';
import { TeamsTable } from '@/components/organization/teams-table';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';

interface TeamsPageProps {
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

async function getCachedTeams(reqHeaders: Headers, organizationId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`organization-teams-${organizationId}`);

  const [teamsRes, activeMemberRes] = await Promise.all([
    auth.api.listOrganizationTeams({
      headers: reqHeaders,
      query: { organizationId },
    }),
    auth.api.getActiveMember({
      headers: reqHeaders,
    }),
  ]);

  return {
    teams: (teamsRes ?? []) as Array<{
      id: string;
      name: string;
      organizationId: string;
      createdAt: Date;
      updatedAt: Date | null;
    }>,
    activeMember: activeMemberRes as { id: string; role: string } | null,
  };
}

export default async function TeamsPage({ params }: TeamsPageProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();

  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    return null;
  }

  const teamsPromise = getCachedTeams(reqHeaders, organization.id);

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
              <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <TeamsTable promises={teamsPromise} orgSlug={slug} />
      </React.Suspense>
    </Shell>
  );
}
