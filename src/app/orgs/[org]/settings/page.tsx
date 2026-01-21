import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';

import { Shell } from '@/components/layout/shell';
import { DeleteOrganizationDialog } from '@/components/organization/delete-organization-dialog';
import { OrganizationSettingsForm } from '@/components/organization/organization-settings-form';
import { UpdateOrganizationLogo } from '@/components/organization/update-organization-logo';
import { auth } from '@/lib/auth';

interface SettingsPageProps {
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

async function getCachedActiveMember(reqHeaders: Headers) {
  'use cache';
  cacheLife('hours');
  cacheTag('active-member');

  return await auth.api.getActiveMember({
    headers: reqHeaders,
  });
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();

  const [organization, activeMember] = await Promise.all([
    getCachedOrganization(reqHeaders, slug),
    getCachedActiveMember(reqHeaders),
  ]);

  if (!organization) {
    return null;
  }

  const isOwner = activeMember?.role === 'owner';

  return (
    <Shell className="max-w-2xl">
      <UpdateOrganizationLogo
        organizationId={organization.id}
        slug={organization.slug}
        logo={organization.logo ?? null}
      />

      <OrganizationSettingsForm
        organization={{
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        }}
      />

      {isOwner && (
        <DeleteOrganizationDialog
          organizationId={organization.id}
          organizationName={organization.name}
        />
      )}
    </Shell>
  );
}
