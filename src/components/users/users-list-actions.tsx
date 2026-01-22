import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Row } from '@tanstack/react-table';
import type { UserWithRole } from 'better-auth/plugins';
import { Ban, Eye, MoreHorizontal, Tag, Trash2, UserCog } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { rolesData } from '@/lib/admin';

export function UserListActions({ row }: { row: Row<UserWithRole> }) {
  const router = useRouter();
  const isBanned = row.original.banned;
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/${row.original.id}`}>
            <Eye className="size-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            const { error } = await authClient.admin.impersonateUser({
              userId: row.original.id,
            });

            if (error) {
              toast.error(error.message);
            } else {
              router.refresh();
              toast.success('Impersonated successfully');
            }
          }}
        >
          <UserCog className="size-4" />
          Impersonate
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            if (isBanned) {
              const { error } = await authClient.admin.unbanUser({
                userId: row.original.id,
              });

              if (error) {
                toast.error(error.message);
              } else {
                toast.success('User unbanned successfully');
                router.refresh();
              }
            } else {
              const { error } = await authClient.admin.banUser({
                userId: row.original.id,
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Tag className="size-4" />
            Labels
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={row.original.role ?? ''}>
              {rolesData.map((label) => (
                <DropdownMenuRadioItem
                  key={label}
                  value={label}
                  className="capitalize"
                  onClick={async () => {
                    const { error } = await authClient.admin.setRole({
                      userId: row.original.id,
                      role: label,
                    });

                    if (error) {
                      toast.error(error.message);
                    } else {
                      toast.success('User role updated successfully');
                      router.refresh();
                    }
                  }}
                >
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium">{row.original.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                setIsDeleting(true);

                const { error } = await authClient.admin.removeUser({
                  userId: row.original.id,
                });

                setIsDeleting(false);

                if (error) {
                  toast.error(error.message);
                } else {
                  setShowDeleteDialog(false);
                  router.refresh();
                  toast.success('User removed successfully');
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
