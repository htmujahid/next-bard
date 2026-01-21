'use client';

import * as React from 'react';

import Link from 'next/link';

import { Plus } from 'lucide-react';

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

import { InvitationsTableActions } from './invitations-table-actions';

export interface Invitation {
  id: string;
  email: string;
  role: string | null;
  status: string;
  expiresAt: Date;
}

interface InvitationsTableProps {
  promises: Promise<Invitation[]>;
  orgSlug: string;
  organizationId: string;
}

export function InvitationsTable({
  promises,
  orgSlug,
  organizationId,
}: InvitationsTableProps) {
  const invitations = React.use(promises);

  return (
    <div className="flex w-full flex-col gap-2.5 overflow-auto">
      <div className="flex w-full items-center justify-between gap-2 p-1">
        <div className="flex-1" />
        <Button asChild>
          <Link href={pathsConfig.orgs.invite(orgSlug)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    {invitation.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {invitation.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invitation.status === 'pending'
                          ? 'secondary'
                          : invitation.status === 'accepted'
                            ? 'default'
                            : 'destructive'
                      }
                      className="capitalize"
                    >
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                  <TableCell>
                    <InvitationsTableActions
                      invitation={invitation}
                      organizationId={organizationId}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No invitations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
