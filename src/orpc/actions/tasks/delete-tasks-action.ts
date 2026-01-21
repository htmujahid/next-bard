'use server';

import { updateTag } from 'next/cache';

import { onError, onSuccess, os } from '@orpc/server';
import * as z from 'zod';

import { deleteTasks } from '@/db/queries/tasks';
import { getErrorMessage } from '@/lib/handle-error';

const deleteTasksActionSchema = z.object({
  ids: z.array(z.string()),
});

export const deleteTasksAction = os
  .input(deleteTasksActionSchema)
  .handler(async ({ input }) => {
    try {
      const deletedTasks = await deleteTasks(input);
      return {
        data: deletedTasks,
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
