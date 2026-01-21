'use server';

import { updateTag } from 'next/cache';

import { onError, onSuccess, os } from '@orpc/server';
import * as z from 'zod';

import { updateTask } from '@/db/queries/tasks';
import { getErrorMessage } from '@/lib/handle-error';
import { updateTaskSchema } from '@/validators/tasks';

const updateTaskActionSchema = updateTaskSchema.extend({
  id: z.string(),
});

export const updateTaskAction = os
  .input(updateTaskActionSchema)
  .handler(async ({ input }) => {
    try {
      const updatedTask = await updateTask(input);
      return {
        data: updatedTask,
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
