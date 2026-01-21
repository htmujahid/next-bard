'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Loader2, MoreHorizontal, RefreshCw, X } from 'lucide-react';
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

import type { Invitation } from './invitations-table';

interface InvitationsTableActionsProps {
  invitation: Invitation;
  organizationId: string;
}

export function InvitationsTableActions({
  invitation,
  organizationId,
}: InvitationsTableActionsProps) {
  const router = useRouter();
  const [resendPending, startResendTransition] = useTransition();

  const handleCancelInvitation = async () => {
    await authClient.organization.cancelInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: () => {
          toast.success('Invitation cancelled');
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleResendInvitation = () => {
    startResendTransition(async () => {
      await authClient.organization.inviteMember(
        {
          email: invitation.email,
          role: invitation.role as 'admin' | 'member',
          organizationId,
          resend: true,
        },
        {
          onSuccess: () => {
            toast.success('Invitation resent successfully');
            router.refresh();
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  };

  if (invitation.status !== 'pending') {
    return null;
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={resendPending}>
            {resendPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleResendInvitation}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Resend Invitation
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Invitation
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel invitation?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel the invitation for{' '}
            {invitation.email}? They will no longer be able to join the
            organization with this invitation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelInvitation}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Cancel Invitation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
