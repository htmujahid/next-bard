import { cacheLife, cacheTag } from 'next/cache';

import { auth } from '@/lib/auth';

export async function getSession(headers: Headers) {
  'use cache';
  cacheLife('hours');
  cacheTag('getSession');

  return await auth.api.getSession({
    headers,
  });
}
