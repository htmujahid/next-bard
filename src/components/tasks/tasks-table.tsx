'use client';

import * as React from 'react';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { Button } from '@/components/ui/button';
import type {
  getTaskEstimatedHoursRange,
  getTaskPriorityCounts,
  getTaskStatusCounts,
  getTasks,
} from '@/db/queries/tasks';
import type { Task } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import type { DataTableRowAction } from '@/types/data-table';

import { DeleteTasksDialog } from './delete-tasks-dialog';
import { TasksTableActionBar } from './tasks-table-action-bar';
import { getTasksTableColumns } from './tasks-table-columns';

interface TasksTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getTasks>>,
      Awaited<ReturnType<typeof getTaskStatusCounts>>,
      Awaited<ReturnType<typeof getTaskPriorityCounts>>,
      Awaited<ReturnType<typeof getTaskEstimatedHoursRange>>,
    ]
  >;
}

export function TasksTable({ promises }: TasksTableProps) {
  const [
    { data, pageCount },
    statusCounts,
    priorityCounts,
    estimatedHoursRange,
  ] = React.use(promises);

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Task> | null>(null);

  const columns = React.useMemo(
    () =>
      getTasksTableColumns({
        statusCounts,
        priorityCounts,
        estimatedHoursRange,
        setRowAction,
      }),
    [statusCounts, priorityCounts, estimatedHoursRange],
  );

  const { table, debounceMs } = useDataTable({
    data,
    columns,
    pageCount,
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
    <>
      <DataTable
        table={table}
        actionBar={<TasksTableActionBar table={table} />}
      >
        <DataTableAdvancedToolbar table={table}>
          <DataTableSortList table={table} align="start" />
          <DataTableFilterMenu table={table} debounceMs={debounceMs} />
          <div className="flex-1"></div>
          <Button asChild size="sm">
            <Link href="/home/tasks/create">
              <Plus />
              New Task
            </Link>
          </Button>
        </DataTableAdvancedToolbar>
      </DataTable>
      <DeleteTasksDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        tasks={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onDeleteSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
