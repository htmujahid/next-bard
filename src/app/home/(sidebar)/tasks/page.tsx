import * as React from 'react';

import { cacheLife, cacheTag } from 'next/cache';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Shell } from '@/components/layout/shell';
import { TasksTable } from '@/components/tasks/tasks-table';
import {
  getTaskEstimatedHoursRange,
  getTaskPriorityCounts,
  getTaskStatusCounts,
  getTasks,
} from '@/db/queries/tasks';
import { getValidFilters } from '@/lib/data-table';
import type { SearchParams } from '@/types';
import { searchParamsCache } from '@/validators/tasks';

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

async function getCachedTasks(searchParams: SearchParams) {
  'use cache';
  cacheLife('hours');
  cacheTag('tasks');

  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);
  return await getTasks({ ...search, filters: validFilters });
}

async function getCachedTaskStatusCounts() {
  'use cache';
  cacheLife('hours');
  cacheTag('tasks');
  return await getTaskStatusCounts();
}

async function getCachedTaskPriorityCounts() {
  'use cache';
  cacheLife('hours');
  cacheTag('tasks');
  return await getTaskPriorityCounts();
}

async function getCachedTaskEstimatedHoursRange() {
  'use cache';
  cacheLife('hours');
  cacheTag('tasks');
  return await getTaskEstimatedHoursRange();
}

export default async function IndexPage(props: IndexPageProps) {
  const promises = Promise.all([
    getCachedTasks(await props.searchParams),
    getCachedTaskStatusCounts(),
    getCachedTaskPriorityCounts(),
    getCachedTaskEstimatedHoursRange(),
  ]);

  return (
    <Shell>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              '10rem',
              '30rem',
              '10rem',
              '10rem',
              '6rem',
              '6rem',
              '6rem',
            ]}
            shrinkZero
          />
        }
      >
        <TasksTable promises={promises} />
      </React.Suspense>
    </Shell>
  );
}
