'use client';

import { useRouter } from 'next/navigation';

import { MoreHorizontal, Shield, Trash2, UserCog } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';

import type { ActiveMember, Member } from './members-table';

interface MembersTableActionsProps {
  member: Member;
  organizationId: string;
  activeMember: ActiveMember | null;
}

export function MembersTableActions({
  member,
  organizationId,
  activeMember,
}: MembersTableActionsProps) {
  const router = useRouter();

  const handleRemoveMember = async () => {
    await authClient.organization.removeMember(
      {
        memberIdOrEmail: member.id,
        organizationId,
      },
      {
        onSuccess: () => {
          toast.success('Member removed successfully');
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleUpdateRole = async (role: 'admin' | 'member') => {
    await authClient.organization.updateMemberRole(
      {
        memberId: member.id,
        role,
        organizationId,
      },
      {
        onSuccess: () => {
          toast.success('Member role updated successfully');
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  if (member.role === 'owner' || member.id === activeMember?.id) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeMember?.role === 'owner' && (
          <>
            {member.role === 'member' && (
              <DropdownMenuItem onClick={() => handleUpdateRole('admin')}>
                <Shield className="mr-2 h-4 w-4" />
                Make Admin
              </DropdownMenuItem>
            )}
            {member.role === 'admin' && (
              <DropdownMenuItem onClick={() => handleUpdateRole('member')}>
                <UserCog className="mr-2 h-4 w-4" />
                Make Member
              </DropdownMenuItem>
            )}
          </>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove member?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {member.user.name} from this
                organization? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveMember}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
