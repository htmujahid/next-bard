'use client';

import type { InitOptions, i18n } from 'i18next';

import { initializeI18nClient } from '@/lib/i18n/i18n-client';
import { i18nResolver } from '@/lib/i18n/i18n-resolver';
import { getI18nSettings } from '@/lib/i18n/i18n-settings';

let i18nInstance: i18n;

type Resolver = (
  lang: string,
  namespace: string,
) => Promise<Record<string, string>>;

export function I18nProvider({
  lang,
  children,
}: React.PropsWithChildren<{
  lang: string;
}>) {
  const settings = getI18nSettings(lang);
  useI18nClient(settings, i18nResolver);

  return children;
}

/**
 * @name useI18nClient
 * @description A hook that initializes the i18n client.
 * @param settings
 * @param resolver
 */
function useI18nClient(settings: InitOptions, resolver: Resolver) {
  if (
    !i18nInstance ||
    i18nInstance.language !== settings.lng ||
    i18nInstance.options.ns?.length !== settings.ns?.length
  ) {
    throw loadI18nInstance(settings, resolver);
  }

  return i18nInstance;
}

async function loadI18nInstance(settings: InitOptions, resolver: Resolver) {
  i18nInstance = await initializeI18nClient(settings, resolver);
}
