import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { UserWithRole } from 'better-auth/plugins';

import { Shell } from '@/components/layout/shell';
import { ChangePasswordForm } from '@/components/users/change-password-form';
import { UpdateUserForm } from '@/components/users/update-user-form';
import { auth } from '@/lib/auth';

async function getUser(userId: string) {
  const response = await auth.api.listUsers({
    headers: await headers(),
    query: {
      filterField: 'id',
      filterValue: userId,
      filterOperator: 'eq',
      limit: 1,
    },
  });

  return response.users[0] as UserWithRole | undefined;
}

export default async function UpdateUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <UpdateUserForm
          userId={user.id}
          defaultValues={{ name: user.name, role: user.role }}
        />
        <ChangePasswordForm userId={user.id} />
      </div>
    </Shell>
  );
}
