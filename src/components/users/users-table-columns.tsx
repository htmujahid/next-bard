'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { UserWithRole } from 'better-auth/plugins';
import { CalendarIcon, Mail, Shield, User } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { rolesData } from '@/lib/admin';

import { UserListActions } from './users-list-actions';

export function getUsersTableColumns(): Array<ColumnDef<UserWithRole>> {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => {
        const name = row.original.name;
        const email = row.original.email;
        const image = row.original.image;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={image ?? undefined} alt={name} />
              <AvatarFallback className="text-xs">
                {name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{name}</span>
              <span className="text-muted-foreground text-xs">{email}</span>
            </div>
          </div>
        );
      },
      meta: {
        label: 'Name',
        placeholder: 'Search by name...',
        variant: 'text',
        icon: User,
      },
      enableColumnFilter: true,
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => {
        const email = row.original.email;
        const emailVerified = row.original.emailVerified;

        return (
          <div className="flex items-center gap-2">
            <span>{email}</span>
            {emailVerified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
          </div>
        );
      },
      meta: {
        label: 'Email',
        placeholder: 'Search by email...',
        variant: 'text',
        icon: Mail,
      },
      enableColumnFilter: false,
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Role" />
      ),
      cell: ({ row }) => {
        const role = row.original.role;

        return (
          <Badge
            variant={role === 'admin' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {role}
          </Badge>
        );
      },
      meta: {
        label: 'Role',
        variant: 'select',
        options: rolesData.map((role) => ({
          label: role.charAt(0).toUpperCase() + role.slice(1),
          value: role,
        })),
        icon: Shield,
      },
      enableColumnFilter: true,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: 'Created At',
        variant: 'date',
        icon: CalendarIcon,
      },
      enableColumnFilter: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => <UserListActions row={row} />,
      size: 50,
    },
  ];
}
