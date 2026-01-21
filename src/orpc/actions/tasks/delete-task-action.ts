'use server';

import { updateTag } from 'next/cache';

import { onError, onSuccess, os } from '@orpc/server';
import * as z from 'zod';

import { deleteTask } from '@/db/queries/tasks';
import { getErrorMessage } from '@/lib/handle-error';

const deleteTaskActionSchema = z.object({
  id: z.string(),
});

export const deleteTaskAction = os
  .input(deleteTaskActionSchema)
  .handler(async ({ input }) => {
    try {
      const deletedTask = await deleteTask(input);
      return {
        data: deletedTask,
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
