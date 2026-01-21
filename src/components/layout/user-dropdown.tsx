'use client';

import Link from 'next/link';

import {
  Building2,
  LayoutDashboard,
  Lock,
  LogOut,
  Palette,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

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
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

import { If } from '../misc/if';

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
  session?: {
    impersonatedBy?: string | null;
  } | null;
}

export function UserDropdown({ user, session }: UserDropdownProps) {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <If condition={user?.role?.split(',').includes('admin')}>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={pathsConfig.admin.root}>
                <Sparkles className="h-4 w-4" />
                Admin
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </If>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={pathsConfig.app.home}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={pathsConfig.orgs.root}>
              <Building2 className="h-4 w-4" />
              Organizations
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={pathsConfig.app.account}>
              <User className="h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={pathsConfig.app.security}>
              <Shield className="h-4 w-4" />
              Security
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={pathsConfig.app.preferences}>
              <Palette className="h-4 w-4" />
              Preferences
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
  );
}
