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
import { createTaskAction } from '@/orpc/actions/tasks/create-task-action';
import { CreateTaskSchema } from '@/validators/tasks';

import { TaskFormFields } from './task-form-fields';

export function CreateTaskForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTaskSchema>({
    defaultValues: {
      title: '',
      label: 'bug',
      status: 'todo',
      priority: 'low',
      estimatedHours: undefined,
    },
  });

  const onSubmit = (value: CreateTaskSchema) => {
    startTransition(async () => {
      const [error] = await createTaskAction(value);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Task created');
      // router.push('/home/tasks')
    });
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Create task</CardTitle>
        <CardDescription>
          Fill in the details below to create a new task
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
                {isPending && <Loader className="animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
