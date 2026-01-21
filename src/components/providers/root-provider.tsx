import { headers } from 'next/headers';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { getRootTheme } from '@/app/layout';
import { AuthProvider } from '@/components/providers/auth-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import appConfig from '@/config/app.config';
import { createI18nServerInstance } from '@/lib/i18n/i18n-server';
import { getSession } from '@/orpc/actions/auth/get-session';

import { ReactQueryProvider } from './react-query-provider';

export async function RootProviders({ children }: React.PropsWithChildren) {
  const session = await getSession(await headers());
  const { language } = await createI18nServerInstance();
  const theme = (await getRootTheme()) ?? appConfig.theme;

  return (
    <ReactQueryProvider>
      <I18nProvider lang={language}>
        <AuthProvider auth={session}>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              enableSystem
              disableTransitionOnChange
              defaultTheme={theme}
              enableColorScheme={false}
            >
              {children}
            </ThemeProvider>
          </NuqsAdapter>
        </AuthProvider>
      </I18nProvider>
    </ReactQueryProvider>
  );
}
