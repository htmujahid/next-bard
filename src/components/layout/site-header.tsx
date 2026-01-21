'use client';

import { useState } from 'react';

import Link from 'next/link';

import { MenuIcon } from 'lucide-react';

import { AppLogo } from '@/components/app-logo';
import { UserDropdown } from '@/components/layout/user-dropdown';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

import { ThemeToggle } from '../misc/theme-toggle';
import { NotificationDropdown } from './notification-dropdown';

export function SiteHeader({
  session,
  user,
}: {
  session: (typeof authClient.$Infer.Session)['session'] | null;
  user: (typeof authClient.$Infer.Session)['user'] | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <AppLogo />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user && <NotificationDropdown />}
          {user ? (
            <UserDropdown user={user} session={session} />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href={pathsConfig.auth.signIn}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href={pathsConfig.auth.signUp}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {user && <NotificationDropdown />}
          {user ? (
            <UserDropdown user={user} session={session} />
          ) : (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <MenuIcon className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-4">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        href={pathsConfig.auth.signIn}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link
                        href={pathsConfig.auth.signUp}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
