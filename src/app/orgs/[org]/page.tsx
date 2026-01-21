import Link from 'next/link';
import { headers } from 'next/headers';

import { cacheLife, cacheTag } from 'next/cache';
import { ArrowRight, Mail, Settings, Users } from 'lucide-react';

import { Shell } from '@/components/layout/shell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface OrganizationPageProps {
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

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { org: slug } = await params;
  const reqHeaders = await headers();
  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    return null;
  }

  const memberCount = organization.members?.length ?? 0;
  const pendingInvitations =
    organization.invitations?.filter((inv) => inv.status === 'pending')
      .length ?? 0;

  return (
    <Shell>
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          {organization.logo && <AvatarImage src={organization.logo} />}
          <AvatarFallback className="text-2xl">
            {organization.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {organization.name}
          </h1>
          <p className="text-muted-foreground mt-1">/{organization.slug}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberCount}</div>
            <CardDescription className="mb-4">
              Active team members
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href={pathsConfig.orgs.members(slug)}>
                Manage Members
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invitations</CardTitle>
            <Mail className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations}</div>
            <CardDescription className="mb-4">
              Pending invitations
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href={pathsConfig.orgs.invitations(slug)}>
                Manage Invitations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <Settings className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage organization settings, name, and logo.
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href={pathsConfig.orgs.settings(slug)}>
                Organization Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
          <CardDescription>
            The most recently added members to your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organization.members && organization.members.length > 0 ? (
            <div className="space-y-4">
              {organization.members.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    {member.user.image && (
                      <AvatarImage src={member.user.image} />
                    )}
                    <AvatarFallback>
                      {member.user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.user.name}</p>
                    <p className="text-muted-foreground text-sm truncate">
                      {member.user.email}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm capitalize">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No members found.</p>
          )}
        </CardContent>
      </Card>
    </Shell>
  );
}
