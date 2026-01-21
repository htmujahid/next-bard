import { headers } from 'next/headers';

import { SiteHeader } from '@/components/layout/site-header';
import { Footer } from '@/components/marketing/footer';
import { CreateOrganizationForm } from '@/components/organization/create-organization-form';
import { getSession } from '@/orpc/actions/auth/get-session';

export default async function CreateOrganizationPage() {
  const session = await getSession(await headers());

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader session={session?.session ?? null} user={session?.user ?? null} />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Organization
            </h1>
            <p className="text-muted-foreground mt-2">
              Set up a new organization to collaborate with your team.
            </p>
          </div>
          <CreateOrganizationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
