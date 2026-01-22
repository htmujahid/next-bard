'use client';

import * as React from 'react';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import pathsConfig from '@/config/paths.config';
import { formatDate } from '@/lib/format';

import { TeamActions } from './team-actions';

export interface Team {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ActiveMember {
  id: string;
  role: string;
}

interface TeamsTableProps {
  promises: Promise<{
    teams: Team[];
    activeMember: ActiveMember | null;
  }>;
  orgSlug: string;
}

export function TeamsTable({ promises, orgSlug }: TeamsTableProps) {
  const { teams, activeMember } = React.use(promises);

  const isOwnerOrAdmin =
    activeMember?.role === 'owner' || activeMember?.role === 'admin';

  return (
    <div className="flex w-full flex-col gap-2.5 overflow-auto">
      <div className="flex w-full items-center justify-between gap-2 p-1">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm">
            Create teams to organize members within your organization.
          </p>
        </div>
        {isOwnerOrAdmin && (
          <Button asChild>
            <Link href={pathsConfig.orgs.createTeam(orgSlug)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Link>
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Created</TableHead>
              {isOwnerOrAdmin && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length > 0 ? (
              teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <Link
                      href={pathsConfig.orgs.teamDetail(orgSlug, team.id)}
                      className="font-medium hover:underline"
                    >
                      {team.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(team.createdAt)}</TableCell>
                  {isOwnerOrAdmin && (
                    <TableCell>
                      <TeamActions team={team} orgSlug={orgSlug} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isOwnerOrAdmin ? 3 : 2}
                  className="h-24 text-center"
                >
                  No teams found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
