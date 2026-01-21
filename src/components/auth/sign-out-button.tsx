'use client';

import { useTransition } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

interface SignOutButtonProps {
  children: React.ReactNode;
  redirectUrl?: string;
}

export function SignOutButton({ children, redirectUrl = '/' }: SignOutButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut();
      window.location.href = redirectUrl;
    });
  };

  return (
    <Button onClick={handleSignOut} disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}
