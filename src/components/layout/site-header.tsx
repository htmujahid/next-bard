'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  LayoutDashboard,
  Lock,
  LogOut,
  MenuIcon,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import { AppLogo } from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

import { If } from '../misc/if';
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

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  const handleStopImpersonation = async () => {
    const { error } = await authClient.admin.stopImpersonating();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Impersonation stopped');
      window.location.href = '/admin/users';
    }
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <AppLogo />
        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user && <NotificationDropdown />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) ?? ''}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <If condition={user?.role?.split(',').includes('admin')}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Sparkles className="h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </If>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/home/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/home/account">
                      <User className="h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/home/account/security">
                      <Shield className="h-4 w-4" />
                      Security
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {session?.impersonatedBy ? (
                  <DropdownMenuItem onClick={handleStopImpersonation}>
                    <Lock className="h-4 w-4" />
                    Stop Impersonation
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) ?? ''}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <If condition={user?.role?.split(',').includes('admin')}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Sparkles className="h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </If>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/home/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/home/account">
                      <User className="h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/home/account/security">
                      <Shield className="h-4 w-4" />
                      Security
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {session?.impersonatedBy ? (
                  <DropdownMenuItem onClick={handleStopImpersonation}>
                    <Lock className="h-4 w-4" />
                    Stop Impersonation
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
