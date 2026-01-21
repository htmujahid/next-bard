'use client';

import { use, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { UserWithRole } from 'better-auth/plugins';
import { Ban, MoreHorizontal, Pencil, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';

interface UserDetailsProps {
  promise: Promise<UserWithRole | undefined>;
}

export function UserDetails({ promise }: UserDetailsProps) {
  const router = useRouter();
  const user = use(promise);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return (
      <Card>
        <CardContent className="text-muted-foreground text-center text-sm">
          User not found
        </CardContent>
      </Card>
    );
  }

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isBanned = user.banned;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <Badge variant="secondary">{user.role}</Badge>
              {isBanned && <Badge variant="destructive">Banned</Badge>}
            </div>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <Badge variant={user.emailVerified ? 'default' : 'outline'}>
            {user.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={async () => {
                  const { error } = await authClient.admin.impersonateUser({
                    userId: user.id,
                  });

                  if (error) {
                    toast.error(error.message);
                  } else {
                    router.push('/');
                    toast.success('Impersonating user');
                  }
                }}
              >
                <UserCog className="size-4" />
                Impersonate
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/users/${user.id}/update`}>
                  <Pencil className="size-4" />
                  Edit User
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  if (isBanned) {
                    const { error } = await authClient.admin.unbanUser({
                      userId: user.id,
                    });

                    if (error) {
                      toast.error(error.message);
                    } else {
                      toast.success('User unbanned successfully');
                      router.refresh();
                    }
                  } else {
                    const { error } = await authClient.admin.banUser({
                      userId: user.id,
                    });

                    if (error) {
                      toast.error(error.message);
                    } else {
                      toast.success('User banned successfully');
                      router.refresh();
                    }
                  }
                }}
              >
                <Ban className="size-4" />
                {isBanned ? 'Unban' : 'Ban'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{' '}
                  <span className="font-medium">{user.name}</span>? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsDeleting(true);

                    const { error } = await authClient.admin.removeUser({
                      userId: user.id,
                    });

                    setIsDeleting(false);

                    if (error) {
                      toast.error(error.message);
                    } else {
                      setShowDeleteDialog(false);
                      router.push('/admin/users');
                      toast.success('User removed successfully');
                    }
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Separator className="my-4" />
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

export function UserDetailsSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Separator className="my-4" />
        <div className="flex gap-6">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
