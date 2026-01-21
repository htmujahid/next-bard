import { headers } from 'next/headers';

import { SiteHeader } from '@/components/layout/site-header';
import { Footer } from '@/components/marketing/footer';
import { getSession } from '@/orpc/actions/auth/get-session';

export default async function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(await headers());

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        session={session?.session ?? null}
        user={session?.user ?? null}
      />
      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
