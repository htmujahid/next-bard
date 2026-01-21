import { notFound } from 'next/navigation';

import { Shell } from '@/components/layout/shell';
import { TaskDetails } from '@/components/tasks/task-details';
import { getTask } from '@/db/queries/tasks';

export default async function RouteComponent({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const task = await getTask(taskId);

  if (!task) {
    notFound();
  }

  return (
    <Shell>
      <TaskDetails task={task} />
    </Shell>
  );
}
