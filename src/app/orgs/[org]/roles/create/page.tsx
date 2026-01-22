import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';

import { Shell } from '@/components/layout/shell';
import { CreateRoleForm } from '@/components/organization/create-role-form';
import { auth } from '@/lib/auth';

interface CreateRolePageProps {
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

export default async function CreateRolePage({ params }: CreateRolePageProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();

  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    return null;
  }

  return (
    <Shell className="max-w-2xl">
      <CreateRoleForm organizationId={organization.id} orgSlug={slug} />
    </Shell>
  );
}
