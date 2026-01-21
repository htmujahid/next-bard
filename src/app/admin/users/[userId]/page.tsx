import { Suspense } from 'react';

import { cacheLife, cacheTag } from 'next/cache';
import { cookies, headers } from 'next/headers';

import { UserWithRole } from 'better-auth/plugins';

import { Shell } from '@/components/layout/shell';
import {
  UserDetails,
  UserDetailsSkeleton,
} from '@/components/users/user-details';
import {
  UserSessions,
  UserSessionsSkeleton,
} from '@/components/users/user-sessions';
import { auth } from '@/lib/auth';

async function getCachedUser(userId: string, headers: Headers) {
  'use cache';
  cacheLife('hours');
  cacheTag('users', userId);
  const response = await auth.api.listUsers({
    headers,
    query: {
      filterField: 'id',
      filterValue: userId,
      filterOperator: 'eq',
      limit: 1,
    },
  });

  const user = response.users[0] as UserWithRole | undefined;

  return user;
}

async function getCachedUserSessions(userId: string, headers: Headers) {
  'use cache';
  cacheLife('hours');
  cacheTag('sessions', userId);
  const { sessions } = await auth.api.listUserSessions({
    headers,
    body: {
      userId,
    },
  });

  return sessions;
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const sessionId = (await cookies()).get('better-auth.session')?.value ?? '';
  const userPromise = getCachedUser(userId, await headers());
  const sessionsPromise = getCachedUserSessions(userId, await headers());

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Suspense fallback={<UserDetailsSkeleton />}>
          <UserDetails promise={userPromise} />
        </Suspense>
        <Suspense fallback={<UserSessionsSkeleton />}>
          <UserSessions promise={sessionsPromise} sessionId={sessionId} />
        </Suspense>
      </div>
    </Shell>
  );
}
