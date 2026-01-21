'use client';

import * as React from 'react';

import type { UserWithRole } from 'better-auth/plugins';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

import { UserCreateDialog } from './user-create';
import { getUsersTableColumns } from './users-table-columns';

interface UsersTableProps {
  promise: Promise<{
    total: number;
    users: Array<UserWithRole>;
    pageCount: number;
  }>;
}

export function UsersTable({ promise }: UsersTableProps) {
  const usersData = React.use(promise);

  const columns = React.useMemo(() => getUsersTableColumns(), []);

  const { table } = useDataTable({
    data: usersData.users,
    columns,
    pageCount: usersData.pageCount,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <div className="flex-1"></div>
        <UserCreateDialog />
      </DataTableToolbar>
    </DataTable>
  );
}
