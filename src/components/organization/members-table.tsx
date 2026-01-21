'use client';

import * as React from 'react';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

export interface Member {
  id: string;
  role: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export interface ActiveMember {
  id: string;
  role: string;
}

interface MembersTableProps {
  promises: Promise<{
    members: Member[];
    activeMember: ActiveMember | null;
  }>;
  orgSlug: string;
}

export function MembersTable({ promises, orgSlug }: MembersTableProps) {
  const { members, activeMember } = React.use(promises);

  const isOwnerOrAdmin =
    activeMember?.role === 'owner' || activeMember?.role === 'admin';

  return (
    <div className="flex w-full flex-col gap-2.5 overflow-auto">
      <div className="flex w-full items-center justify-between gap-2 p-1">
        <div className="flex-1" />
        {isOwnerOrAdmin && (
          <Button asChild>
            <Link href={pathsConfig.orgs.invite(orgSlug)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Link>
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length > 0 ? (
              members.map((member) => {
                const isCurrentUser = member.id === activeMember?.id;
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Link
                        href={pathsConfig.orgs.memberDetail(orgSlug, member.id)}
                        className="flex items-center gap-3 hover:opacity-80"
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={member.user.image ?? undefined}
                            alt={member.user.name}
                          />
                          <AvatarFallback className="text-xs">
                            {member.user.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2) ?? 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium underline-offset-4 hover:underline">
                            {member.user.name}
                            {isCurrentUser && (
                              <span className="text-muted-foreground ml-1 text-xs font-normal">
                                (you)
                              </span>
                            )}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {member.user.email}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{formatDate(member.createdAt)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
