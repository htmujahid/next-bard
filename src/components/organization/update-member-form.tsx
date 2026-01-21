'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

const updateMemberSchema = z.object({
  role: z.enum(['admin', 'member'], {
    message: 'Please select a role',
  }),
});

type UpdateMemberFormValues = z.infer<typeof updateMemberSchema>;

interface UpdateMemberFormProps {
  memberId: string;
  organizationId: string;
  currentRole: string;
  memberName: string;
  orgSlug: string;
}

export function UpdateMemberForm({
  memberId,
  organizationId,
  currentRole,
  memberName,
  orgSlug,
}: UpdateMemberFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<UpdateMemberFormValues>({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      role: currentRole as 'admin' | 'member',
    },
  });

  const onSubmit = (values: UpdateMemberFormValues) => {
    if (values.role === currentRole) {
      toast.info('No changes to save');
      return;
    }

    startTransition(async () => {
      await authClient.organization.updateMemberRole(
        {
          memberId,
          role: values.role,
          organizationId,
        },
        {
          onSuccess: () => {
            toast.success(`${memberName}'s role updated to ${values.role}`);
            router.push(pathsConfig.orgs.members(orgSlug));
            router.refresh();
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the role for this member in the organization.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Role
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(pathsConfig.orgs.members(orgSlug))}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
