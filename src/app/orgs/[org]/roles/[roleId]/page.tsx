import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';

import { Shell } from '@/components/layout/shell';
import { EditRoleForm } from '@/components/organization/edit-role-form';
import { auth } from '@/lib/auth';

interface EditRolePageProps {
  params: Promise<{ org: string; roleId: string }>;
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

async function getCachedRole(
  reqHeaders: Headers,
  organizationId: string,
  roleId: string,
) {
  'use cache';
  cacheLife('hours');
  cacheTag(`organization-role-${roleId}`);

  return await auth.api.getOrgRole({
    headers: reqHeaders,
    query: {
      roleId,
      organizationId,
    },
  });
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { org: slug, roleId } = await params;
  const reqHeaders = await headers();

  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    return notFound();
  }

  const role = await getCachedRole(reqHeaders, organization.id, roleId);

  if (!role) {
    return notFound();
  }

  return (
    <Shell className="max-w-2xl">
      <EditRoleForm
        role={{
          id: role.id,
          role: role.role,
          permission: role.permission as Record<string, string[]> | null,
          organizationId: role.organizationId,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt ?? null,
        }}
        orgSlug={slug}
      />
    </Shell>
  );
}
