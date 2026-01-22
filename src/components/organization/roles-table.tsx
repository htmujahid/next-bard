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

import { RoleActions } from './role-actions';

export interface OrgRole {
  id: string;
  role: string;
  permission: Record<string, string[]> | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ActiveMember {
  id: string;
  role: string;
}

interface RolesTableProps {
  promises: Promise<{
    roles: OrgRole[];
    activeMember: ActiveMember | null;
  }>;
  orgSlug: string;
}

export function RolesTable({ promises, orgSlug }: RolesTableProps) {
  const { roles, activeMember } = React.use(promises);

  const isOwnerOrAdmin =
    activeMember?.role === 'owner' || activeMember?.role === 'admin';

  return (
    <div className="flex w-full flex-col gap-2.5 overflow-auto">
      <div className="flex w-full items-center justify-between gap-2 p-1">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm">
            Create custom roles for your organization with specific permissions.
          </p>
        </div>
        {isOwnerOrAdmin && (
          <Button asChild>
            <Link href={pathsConfig.orgs.createRole(orgSlug)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Link>
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created</TableHead>
              {isOwnerOrAdmin && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => {
                const permissionCount = role.permission
                  ? Object.values(role.permission).flat().length
                  : 0;

                return (
                  <TableRow key={role.id}>
                    <TableCell>
                      <span className="font-medium capitalize">
                        {role.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permission ? (
                          Object.entries(role.permission)
                            .slice(0, 3)
                            .map(([resource, actions]) => (
                              <Badge
                                key={resource}
                                variant="secondary"
                                className="text-xs"
                              >
                                {resource}: {(actions as string[]).length}
                              </Badge>
                            ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No permissions
                          </span>
                        )}
                        {role.permission &&
                          Object.keys(role.permission).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{Object.keys(role.permission).length - 3} more
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{permissionCount}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(role.createdAt)}</TableCell>
                    {isOwnerOrAdmin && (
                      <TableCell>
                        <RoleActions role={role} orgSlug={orgSlug} />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isOwnerOrAdmin ? 5 : 4}
                  className="h-24 text-center"
                >
                  No custom roles found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
