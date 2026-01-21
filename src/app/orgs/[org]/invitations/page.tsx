import * as React from 'react';

import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';

import { Shell } from '@/components/layout/shell';
import { InvitationsTable } from '@/components/organization/invitations-table';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';

interface InvitationsPageProps {
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

async function getCachedInvitations(
  reqHeaders: Headers,
  organizationId: string,
) {
  'use cache';
  cacheLife('hours');
  cacheTag(`organization-invitations-${organizationId}`);

  const invitations = await auth.api.listInvitations({
    headers: reqHeaders,
    query: { organizationId },
  });

  return (invitations ?? []) as Array<{
    id: string;
    email: string;
    role: string | null;
    status: string;
    expiresAt: Date;
  }>;
}

export default async function InvitationsPage({
  params,
}: InvitationsPageProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();
  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    return null;
  }

  const invitationsPromise = getCachedInvitations(reqHeaders, organization.id);

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
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <InvitationsTable promises={invitationsPromise} orgSlug={slug} />
      </React.Suspense>
    </Shell>
  );
}
