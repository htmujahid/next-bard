import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';

import { Shell } from '@/components/layout/shell';
import { InviteMemberForm } from '@/components/organization/invite-member-form';
import { auth } from '@/lib/auth';

interface InvitePageProps {
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

async function getCachedRoles(reqHeaders: Headers, organizationId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`organization-roles-${organizationId}`);

  const roles = await auth.api.listOrgRoles({
    headers: reqHeaders,
    query: { organizationId },
  });

  return (roles ?? []) as Array<{
    id: string;
    role: string;
  }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();
  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    return null;
  }

  const customRoles = await getCachedRoles(reqHeaders, organization.id);

  return (
    <Shell>
      <div className="mx-auto w-full max-w-md">
        <InviteMemberForm
          organizationId={organization.id}
          orgSlug={slug}
          customRoles={customRoles}
        />
      </div>
    </Shell>
  );
}
