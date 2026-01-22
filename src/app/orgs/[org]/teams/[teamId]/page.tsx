import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { cacheLife, cacheTag } from 'next/cache';
import { ChevronLeft } from 'lucide-react';

import { Shell } from '@/components/layout/shell';
import { TeamMembers } from '@/components/organization/team-members';
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

interface TeamDetailPageProps {
  params: Promise<{ org: string; teamId: string }>;
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

interface TeamMemberRaw {
  id: string;
  teamId: string;
  userId: string;
  createdAt: Date;
}

interface OrgMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

async function getTeamDetails(
  reqHeaders: Headers,
  organizationId: string,
  teamId: string,
) {
  const [teamsRes, membersRes, activeMemberRes] = await Promise.all([
    auth.api.listOrganizationTeams({
      headers: reqHeaders,
      query: { organizationId },
    }),
    auth.api.listMembers({
      headers: reqHeaders,
      query: { organizationId },
    }),
    auth.api.getActiveMember({
      headers: reqHeaders,
    }),
  ]);

  const teams = teamsRes ?? [];
  const team = teams.find((t: { id: string }) => t.id === teamId);
  const orgMembers = (membersRes?.members ?? []) as OrgMember[];

  // Get team members and enrich with user info from org members
  let teamMembers: Array<{
    id: string;
    odeMemberId: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  }> = [];

  if (team) {
    try {
      const teamMembersRes = await auth.api.listTeamMembers({
        headers: reqHeaders,
        query: { teamId },
      });
      const rawTeamMembers = (teamMembersRes ?? []) as TeamMemberRaw[];

      // Map team members to include user info from org members
      teamMembers = rawTeamMembers
        .map((tm) => {
          const orgMember = orgMembers.find((om) => om.user.id === tm.userId);
          if (!orgMember) return null;
          return {
            id: tm.id,
            odeMemberId: orgMember.id,
            role: orgMember.role,
            user: orgMember.user,
          };
        })
        .filter((m): m is NonNullable<typeof m> => m !== null);
    } catch {
      teamMembers = [];
    }
  }

  return {
    team: team as {
      id: string;
      name: string;
      organizationId: string;
      createdAt: Date;
      updatedAt: Date | null;
    } | null,
    teamMembers,
    orgMembers,
    activeMember: activeMemberRes as { id: string; role: string } | null,
  };
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { org: slug, teamId } = await params;
  const reqHeaders = await headers();

  const organization = await getCachedOrganization(reqHeaders, slug);

  if (!organization) {
    notFound();
  }

  const { team, teamMembers, orgMembers, activeMember } = await getTeamDetails(
    reqHeaders,
    organization.id,
    teamId,
  );

  if (!team) {
    notFound();
  }

  const isOwnerOrAdmin =
    activeMember?.role === 'owner' || activeMember?.role === 'admin';

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={pathsConfig.orgs.teams(slug)}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground text-sm">
              Team details and members
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>Basic information about this team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Name</span>
                <span className="font-medium">{team.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Members</span>
                <span className="font-medium">{teamMembers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Created</span>
                <span className="text-sm">{formatDate(team.createdAt)}</span>
              </div>
              {team.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Updated</span>
                  <span className="text-sm">{formatDate(team.updatedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <TeamMembers
            teamId={team.id}
            teamName={team.name}
            organizationId={organization.id}
            teamMembers={teamMembers}
            orgMembers={orgMembers}
            isOwnerOrAdmin={isOwnerOrAdmin}
          />
        </div>
      </div>
    </Shell>
  );
}
