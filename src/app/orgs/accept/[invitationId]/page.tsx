import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { AlertCircle, LogOut } from 'lucide-react';

import { AcceptInvitationForm } from '@/components/auth/accept-invitation-form';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import pathsConfig from '@/config/paths.config';
import { auth } from '@/lib/auth';

interface AcceptInvitationPageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function AcceptInvitationPage({
  params,
}: AcceptInvitationPageProps) {
  const { invitationId } = await params;
  const reqHeaders = await headers();

  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    const redirectUrl = pathsConfig.orgs.acceptInvitation(invitationId);
    redirect(`${pathsConfig.auth.signIn}?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  let invitation;
  let error: string | null = null;

  try {
    invitation = await auth.api.getInvitation({
      headers: reqHeaders,
      query: { id: invitationId },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('not the recipient')) {
      error = 'wrong_account';
    } else {
      throw err;
    }
  }

  if (!invitation && !error) {
    notFound();
  }

  if (error === 'wrong_account') {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Wrong Account</CardTitle>
              <CardDescription>
                This invitation was sent to a different email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                  You&apos;re signed in as <strong>{session.user.email}</strong>,
                  but this invitation was sent to a different email address.
                </AlertDescription>
              </Alert>
              <div className="text-muted-foreground text-center text-sm">
                <p>Please sign out and sign in with the correct account to accept this invitation.</p>
              </div>
              <div className="flex flex-col gap-3">
                <SignOutButton
                  redirectUrl={pathsConfig.orgs.acceptInvitation(invitationId)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out and switch account
                </SignOutButton>
                <Button variant="outline" asChild className="w-full">
                  <Link href={pathsConfig.app.home}>Go to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Organization Invitation</CardTitle>
            <CardDescription>
              You&apos;ve been invited to join{' '}
              <strong>{invitation!.organizationName}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-muted-foreground text-center text-sm">
              <p>
                Invited by <strong>{invitation!.inviterEmail}</strong>
              </p>
              <p className="mt-1">
                Role: <strong className="capitalize">{invitation!.role}</strong>
              </p>
            </div>
            <AcceptInvitationForm
              invitationId={invitationId}
              orgSlug={invitation!.organizationSlug}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
