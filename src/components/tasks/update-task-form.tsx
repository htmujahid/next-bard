'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { Loader } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Task } from '@/db/schema';
import { updateTaskAction } from '@/orpc/actions/tasks/update-task-action';
import { CreateTaskSchema } from '@/validators/tasks';

import { TaskFormFields } from './task-form-fields';

interface UpdateTaskFormProps {
  task: Task;
}

export function UpdateTaskForm({ task }: UpdateTaskFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTaskSchema>({
    defaultValues: {
      title: task.title ?? '',
      label: task.label,
      status: task.status,
      priority: task.priority,
      estimatedHours: task.estimatedHours ?? undefined,
    },
  });

  const onSubmit = async (value: CreateTaskSchema) => {
    startTransition(async () => {
      const [error] = await updateTaskAction({ id: task.id, ...value });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Task updated');
      router.push('/home/tasks');
    });
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Update task</CardTitle>
        <CardDescription>
          Update the task details and save the changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TaskFormFields />
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/home/tasks')}
              >
                Cancel
              </Button>
              <Button disabled={isPending}>
                {isPending && <Loader className="mr-2 size-4 animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
