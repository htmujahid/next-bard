'use server';

import { updateTag } from 'next/cache';

import { onError, onSuccess, os } from '@orpc/server';
import * as z from 'zod';

import { updateTasks } from '@/db/queries/tasks';
import { getErrorMessage } from '@/lib/handle-error';
import { updateTaskSchema } from '@/validators/tasks';

const updateTasksActionSchema = updateTaskSchema.extend({
  ids: z.array(z.string()),
});

export const updateTasksAction = os
  .input(updateTasksActionSchema)
  .handler(async ({ input }) => {
    try {
      const updatedTasks = await updateTasks(input);
      return {
        data: updatedTasks,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: getErrorMessage(error),
      };
    }
  })
  .actionable({
    interceptors: [
      onSuccess(async () => {
        updateTag('tasks');
        updateTag('task-status-counts');
        updateTag('task-priority-counts');
        updateTag('task-estimated-hours-range');
      }),
      onError(async (error) => {
        console.error(getErrorMessage(error));
      }),
    ],
  });
