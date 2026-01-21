'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Loader2, LogOut, Trash2 } from 'lucide-react';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

interface MemberActionsProps {
  memberId: string;
  memberName: string;
  organizationId: string;
  orgSlug: string;
  isCurrentUser: boolean;
  canRemove: boolean;
}

export function MemberActions({
  memberId,
  memberName,
  organizationId,
  orgSlug,
  isCurrentUser,
  canRemove,
}: MemberActionsProps) {
  const router = useRouter();
  const [leavePending, startLeaveTransition] = useTransition();
  const [removePending, startRemoveTransition] = useTransition();

  const handleLeaveOrganization = () => {
    startLeaveTransition(async () => {
      await authClient.organization.leave(
        {
          organizationId,
        },
        {
          onSuccess: () => {
            toast.success('You have left the organization');
            router.push(pathsConfig.orgs.root);
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  };

  const handleRemoveMember = () => {
    startRemoveTransition(async () => {
      await authClient.organization.removeMember(
        {
          memberIdOrEmail: memberId,
          organizationId,
        },
        {
          onSuccess: () => {
            toast.success('Member removed successfully');
            router.push(pathsConfig.orgs.members(orgSlug));
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  };

  if (!isCurrentUser && !canRemove) {
    return null;
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions for this membership
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCurrentUser && (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Leave Organization</p>
              <p className="text-muted-foreground text-sm">
                Remove yourself from this organization
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={leavePending}>
                  {leavePending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Leave
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave organization?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave this organization? You will
                    lose access to all organization resources and will need to
                    be invited again to rejoin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveOrganization}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Leave Organization
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {canRemove && !isCurrentUser && (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Remove Member</p>
              <p className="text-muted-foreground text-sm">
                Remove {memberName} from this organization
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={removePending}>
                  {removePending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove member?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove {memberName} from this
                    organization? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveMember}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove Member
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
