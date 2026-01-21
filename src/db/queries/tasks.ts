import { asc, count, desc, eq, gt, inArray, sql } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

import { db } from '@/db';
import { filterColumns } from '@/lib/filter-columns';
import type {
  CreateTaskSchema,
  GetTasksSchema,
  UpdateTaskSchema,
} from '@/validators/tasks';

import { type Task, tasks } from '../schema';
import { takeFirstOrThrow } from '../utils';

export async function getTask(id: string) {
  const task = await db.select().from(tasks).where(eq(tasks.id, id));
  return task[0] ?? null;
}

export async function getTasks(input: GetTasksSchema) {
  try {
    const offset = (input.page - 1) * input.perPage;

    const advancedWhere = filterColumns({
      table: tasks,
      filters: input.filters,
      joinOperator: input.joinOperator,
    });

    const where = advancedWhere;

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) =>
            item.desc ? desc(tasks[item.id]) : asc(tasks[item.id]),
          )
        : [asc(tasks.createdAt)];

    const data = await db
      .select()
      .from(tasks)
      .limit(input.perPage)
      .offset(offset)
      .where(where)
      .orderBy(...orderBy);

    const total = await db
      .select({
        count: count(),
      })
      .from(tasks)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);

    const pageCount = Math.ceil(total / input.perPage);
    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function getTaskStatusCounts() {
  try {
    return await db
      .select({
        status: tasks.status,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.status)
      .having(gt(count(tasks.status), 0))
      .then((res) =>
        res.reduce(
          (acc, { status, count }) => {
            acc[status] = count;
            return acc;
          },
          {
            todo: 0,
            'in-progress': 0,
            done: 0,
            canceled: 0,
          },
        ),
      );
  } catch {
    return {
      todo: 0,
      'in-progress': 0,
      done: 0,
      canceled: 0,
    };
  }
}

export async function getTaskPriorityCounts() {
  try {
    return await db
      .select({
        priority: tasks.priority,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.priority)
      .having(gt(count(), 0))
      .then((res) =>
        res.reduce(
          (acc, { priority, count }) => {
            acc[priority] = count;
            return acc;
          },
          {
            low: 0,
            medium: 0,
            high: 0,
          },
        ),
      );
  } catch {
    return {
      low: 0,
      medium: 0,
      high: 0,
    };
  }
}

export async function getTaskEstimatedHoursRange() {
  try {
    return await db
      .select({
        min: sql<number>`min(${tasks.estimatedHours})`,
        max: sql<number>`max(${tasks.estimatedHours})`,
      })
      .from(tasks)
      .then((res) => res[0] ?? { min: 0, max: 0 });
  } catch {
    return { min: 0, max: 0 };
  }
}

export async function createTask(input: CreateTaskSchema) {
  return await db
    .insert(tasks)
    .values({
      code: `TASK-${customAlphabet('0123456789', 4)()}`,
      title: input.title,
      status: input.status,
      label: input.label,
      priority: input.priority,
    })
    .returning()
    .then(takeFirstOrThrow);
}

export async function updateTask(input: UpdateTaskSchema & { id: string }) {
  return await db
    .update(tasks)
    .set({
      title: input.title,
      label: input.label,
      status: input.status,
      priority: input.priority,
    })
    .where(eq(tasks.id, input.id))
    .returning()
    .then(takeFirstOrThrow);
}

export async function updateTasks(input: {
  ids: string[];
  label?: Task['label'];
  status?: Task['status'];
  priority?: Task['priority'];
}) {
  return await db
    .update(tasks)
    .set({
      label: input.label,
      status: input.status,
      priority: input.priority,
    })
    .where(inArray(tasks.id, input.ids))
    .returning();
}

export async function deleteTask(input: { id: string }) {
  return await db.delete(tasks).where(eq(tasks.id, input.id)).returning();
}

export async function deleteTasks(input: { ids: string[] }) {
  return await db.delete(tasks).where(inArray(tasks.id, input.ids)).returning();
}
