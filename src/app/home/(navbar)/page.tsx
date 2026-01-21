import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowRight, KeyRound, List, Settings, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import pathsConfig from '@/config/paths.config';
import { requireSession } from '@/orpc/actions/user/require-session';

export default async function HomePage() {
  const [error, session] = await requireSession();

  if (error) {
    redirect(pathsConfig.auth.signIn);
  }

  const { user } = session;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s an overview of your account and quick actions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <List className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage your tasks and track progress.
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href="/home/tasks">
                View Tasks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account</CardTitle>
            <Settings className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Update your profile and email settings.
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href="/home/account">
                Manage Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Password, sessions, and two-factor auth.
            </CardDescription>
            <Button variant="outline" size="sm" asChild>
              <Link href="/home/security">
                Security Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Account Info</h2>
        <Card>
          <CardContent className="pt-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-sm">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">
                  Email Verified
                </dt>
                <dd className="font-medium">
                  {user.emailVerified ? 'Yes' : 'No'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Role</dt>
                <dd className="font-medium capitalize">
                  {user.role || 'User'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Two-Factor</dt>
                <dd className="flex items-center gap-2 font-medium">
                  <KeyRound className="h-4 w-4" />
                  {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
