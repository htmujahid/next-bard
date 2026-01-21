import { cookies, headers } from 'next/headers';

import { AccountSessions } from '@/components/account/account-sessions';
import { UpdateAccountPasswordForm } from '@/components/account/update-account-password-form';
import { auth } from '@/lib/auth';

export default async function SecurityPage() {
  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  if (!sessions) {
    throw new Error('Failed to fetch sessions');
  }

  const sessionId = (await cookies()).get('better-auth.session')?.value ?? '';

  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <UpdateAccountPasswordForm />
      <AccountSessions sessionId={sessionId} sessions={sessions} />
    </div>
  );
}
