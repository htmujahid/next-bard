'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

interface AcceptInvitationFormProps {
  invitationId: string;
  orgSlug: string;
}

export function AcceptInvitationForm({
  invitationId,
  orgSlug,
}: AcceptInvitationFormProps) {
  const router = useRouter();
  const [acceptPending, startAcceptTransition] = useTransition();
  const [rejectPending, startRejectTransition] = useTransition();

  const isPending = acceptPending || rejectPending;

  const handleAccept = () => {
    startAcceptTransition(async () => {
      await authClient.organization.acceptInvitation(
        {
          invitationId,
        },
        {
          onSuccess: (ctx) => {
            toast.success('Invitation accepted successfully');
            router.push(pathsConfig.orgs.detail(ctx.data.member.organizationSlug ?? orgSlug));
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  };

  const handleReject = () => {
    startRejectTransition(async () => {
      await authClient.organization.rejectInvitation(
        {
          invitationId,
        },
        {
          onSuccess: () => {
            toast.success('Invitation rejected');
            router.push(pathsConfig.app.home);
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={handleAccept} disabled={isPending} className="w-full">
        {acceptPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Accept Invitation
      </Button>
      <Button
        variant="outline"
        onClick={handleReject}
        disabled={isPending}
        className="w-full"
      >
        {rejectPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Reject Invitation
      </Button>
    </div>
  );
}
