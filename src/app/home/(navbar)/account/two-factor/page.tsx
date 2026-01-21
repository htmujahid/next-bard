import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { TwoFactorContainer } from '@/components/account/two-factor-container';
import pathsConfig from '@/config/paths.config';
import { getSession } from '@/orpc/actions/auth/get-session';

export default async function TwoFactorPage() {
  const session = await getSession(await headers());

  if (!session) {
    redirect(pathsConfig.auth.signIn);
  }

  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <TwoFactorContainer session={session} />
    </div>
  );
}
