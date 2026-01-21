import { Suspense } from 'react';

import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';

import { RootProviders } from '@/components/providers/root-provider';
import { Toaster } from '@/components/ui/sonner';
import appConfig from '@/config/app.config';
import '@/orpc/server';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={'en'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <RootProviders>{children}</RootProviders>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}

type Theme = 'light' | 'dark' | 'system';

/**
 * @name getRootTheme
 * @description Get the root theme from the cookies or default theme.
 * @returns The root theme.
 */
export async function getRootTheme() {
  const cookiesStore = await cookies();

  const themeCookie = cookiesStore.get('theme')?.value as Theme;

  return themeCookie ?? process.env.NEXT_PUBLIC_DEFAULT_THEME_MODE ?? 'light';
}
