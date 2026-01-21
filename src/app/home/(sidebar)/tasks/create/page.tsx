import { Shell } from '@/components/layout/shell';
import { CreateTaskForm } from '@/components/tasks/create-task-form';

export default async function CreateTaskPage() {
  return (
    <Shell>
      <CreateTaskForm />
    </Shell>
  );
}
