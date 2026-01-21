import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { cacheLife, cacheTag } from 'next/cache';
import { ChevronLeft } from 'lucide-react';

import { Shell } from '@/components/layout/shell';
import { MemberActions } from '@/components/organization/member-actions';
import { UpdateMemberForm } from '@/components/organization/update-member-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import pathsConfig from '@/config/paths.config';
import { auth } from '@/lib/auth';
import { formatDate } from '@/lib/format';

interface MemberDetailPageProps {
  params: Promise<{ org: string; memberId: string }>;
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

async function getMemberDetails(
  reqHeaders: Headers,
  organizationId: string,
  memberId: string,
) {
  const [membersRes, activeMemberRes] = await Promise.all([
    auth.api.listMembers({
      headers: reqHeaders,
      query: { organizationId },
    }),
    auth.api.getActiveMember({
      headers: reqHeaders,
    }),
  ]);

  const members = membersRes?.members ?? [];
  const member = members.find((m: { id: string }) => m.id === memberId);

  return {
    member: member as {
      id: string;
      role: string;
      createdAt: Date;
      user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
    } | null,
    activeMember: activeMemberRes as { id: string; role: string } | null,
  };
}

export default async function MemberDetailPage({
  params,
}: MemberDetailPageProps) {
  const { org: slug, memberId } = await params;
  const reqHeaders = await headers();

  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    notFound();
  }

  const { member, activeMember } = await getMemberDetails(
    reqHeaders,
    organization.id,
    memberId,
  );

  if (!member) {
    notFound();
  }

  const isOwner = activeMember?.role === 'owner';
  const isOwnerOrAdmin =
    activeMember?.role === 'owner' || activeMember?.role === 'admin';
  const isCurrentUser = member.id === activeMember?.id;
  const isMemberOwner = member.role === 'owner';
  const canEditRole = isOwner && !isMemberOwner && !isCurrentUser;
  const canRemove = isOwnerOrAdmin && !isMemberOwner && !isCurrentUser;

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={pathsConfig.orgs.members(slug)}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Member Details</h1>
            <p className="text-muted-foreground text-sm">
              View and manage member information
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Member profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={member.user.image ?? undefined}
                    alt={member.user.name}
                  />
                  <AvatarFallback className="text-lg">
                    {member.user.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2) ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {member.user.name}
                    {isCurrentUser && (
                      <span className="text-muted-foreground ml-2 text-sm font-normal">
                        (you)
                      </span>
                    )}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Current Role
                  </span>
                  <Badge
                    variant={
                      member.role === 'owner'
                        ? 'default'
                        : member.role === 'admin'
                          ? 'secondary'
                          : 'outline'
                    }
                    className="capitalize"
                  >
                    {member.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Joined
                  </span>
                  <span className="text-sm">{formatDate(member.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {canEditRole && (
            <Card>
              <CardHeader>
                <CardTitle>Update Role</CardTitle>
                <CardDescription>
                  Change the member&apos;s role in this organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateMemberForm
                  memberId={member.id}
                  organizationId={organization.id}
                  currentRole={member.role}
                  memberName={member.user.name}
                  orgSlug={slug}
                />
              </CardContent>
            </Card>
          )}

          {!canEditRole && !isMemberOwner && (
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Role update information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {isCurrentUser
                    ? 'You cannot change your own role.'
                    : 'Only the organization owner can change member roles.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {(isCurrentUser || canRemove) && !isMemberOwner && (
          <MemberActions
            memberId={member.id}
            memberName={member.user.name}
            organizationId={organization.id}
            orgSlug={slug}
            isCurrentUser={isCurrentUser}
            canRemove={canRemove}
          />
        )}
      </div>
    </Shell>
  );
}
