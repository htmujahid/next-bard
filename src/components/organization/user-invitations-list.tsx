'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authClient } from '@/lib/auth-client';

interface UserInvitation {
  id: string;
  organizationName: string;
  role: string | null;
  status: string;
  expiresAt: Date;
}

interface UserInvitationsListProps {
  promises: Promise<UserInvitation[]>;
}

export function UserInvitationsList({ promises }: UserInvitationsListProps) {
  const router = useRouter();
  const invitations = React.use(promises);

  const handleAccept = async (invitationId: string) => {
    await authClient.organization.acceptInvitation(
      { invitationId },
      {
        onSuccess: () => {
          toast.success('Invitation accepted');
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleReject = async (invitationId: string) => {
    await authClient.organization.rejectInvitation(
      { invitationId },
      {
        onSuccess: () => {
          toast.success('Invitation rejected');
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === 'pending',
  );

  if (pendingInvitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          You have been invited to join the following organizations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingInvitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">
                  {invitation.organizationName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{invitation.role}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(invitation.expiresAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(invitation.id)}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(invitation.id)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
