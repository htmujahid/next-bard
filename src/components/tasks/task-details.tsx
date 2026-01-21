'use client';

import { createElement } from 'react';

import Link from 'next/link';

import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Task } from '@/db/schema';

import { getPriorityIcon, getStatusIcon } from './utils';

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const statusIcon = getStatusIcon(task.status);
  const priorityIcon = getPriorityIcon(task.priority);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/home/tasks">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <CardDescription className="font-mono">
                {task.code}
              </CardDescription>
              <CardTitle>{task.title || 'Untitled'}</CardTitle>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/home/tasks/${task.id}/update`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {task.label}
          </Badge>
          <Badge variant="secondary" className="gap-1 capitalize">
            {createElement(statusIcon, { className: 'size-3.5' })}
            {task.status}
          </Badge>
          <Badge variant="secondary" className="gap-1 capitalize">
            {createElement(priorityIcon, { className: 'size-3.5' })}
            {task.priority}
          </Badge>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
              <Clock className="size-4" />
              Estimated Hours
            </dt>
            <dd className="font-medium">
              {task.estimatedHours ? `${task.estimatedHours}h` : '—'}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground text-sm">Archived</dt>
            <dd className="font-medium">{task.archived ? 'Yes' : 'No'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="size-4" />
              Created
            </dt>
            <dd className="font-medium">{format(task.createdAt, 'PPP')}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="size-4" />
              Updated
            </dt>
            <dd className="font-medium">
              {task.updatedAt ? format(task.updatedAt, 'PPP') : '—'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
