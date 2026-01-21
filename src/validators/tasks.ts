import {
  createSearchParamsCache,
  createStandardSchemaV1,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';
import * as z from 'zod';

import { type Task, tasks } from '@/db/schema';
import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers';

const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Task>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  title: parseAsString.withDefault(''),
  status: parseAsArrayOf(
    parseAsStringEnum(tasks.status.enumValues),
  ).withDefault([]),
  priority: parseAsArrayOf(
    parseAsStringEnum(tasks.priority.enumValues),
  ).withDefault([]),
  estimatedHours: parseAsArrayOf(parseAsInteger).withDefault([]),
  createdAt: parseAsArrayOf(parseAsString).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
  filterFlag: parseAsStringEnum(['advancedFilters', 'commandFilters']),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);

export const listTasksSchema = createStandardSchemaV1(searchParamsParsers);

export const getTaskSchema = z.object({
  id: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string(),
  label: z.enum(tasks.label.enumValues),
  status: z.enum(tasks.status.enumValues),
  priority: z.enum(tasks.priority.enumValues),
  estimatedHours: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  label: z.enum(tasks.label.enumValues).optional(),
  status: z.enum(tasks.status.enumValues).optional(),
  priority: z.enum(tasks.priority.enumValues).optional(),
  estimatedHours: z.number().optional(),
});

export const updateTasksSchema = z.object({
  ids: z.array(z.string()),
  label: z.enum(tasks.label.enumValues).optional(),
  status: z.enum(tasks.status.enumValues).optional(),
  priority: z.enum(tasks.priority.enumValues).optional(),
});

export const deleteTaskSchema = z.object({
  id: z.string(),
});

export const deleteTasksSchema = z.object({
  ids: z.array(z.string()),
});

export type GetTasksSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
