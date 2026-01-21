import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import pathsConfig from '@/config/paths.config';
import { getSession } from '@/orpc/actions/auth/get-session';

export default async function OrgsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(await headers());

  if (!session) {
    redirect(pathsConfig.auth.signIn);
  }

  return <>{children}</>;
}
