'use server';

import { updateTag } from 'next/cache';

import { onError, onSuccess, os } from '@orpc/server';

import { createTask } from '@/db/queries/tasks';
import { getErrorMessage } from '@/lib/handle-error';
import { createTaskSchema } from '@/validators/tasks';

export const createTaskAction = os
  .input(createTaskSchema)
  .handler(async ({ input }) => {
    try {
      const newTask = await createTask(input);
      return {
        data: newTask,
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
