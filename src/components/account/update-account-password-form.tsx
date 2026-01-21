'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const updatePasswordSchema = z.object({
  current_password: z.string().min(8),
  new_password: z.string().min(8),
  revoke_other_sessions: z.boolean(),
});

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export function UpdateAccountPasswordForm() {
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      revoke_other_sessions: true,
    },
  });

  const onSubmit = async (values: UpdatePasswordFormValues) => {
    await authClient.changePassword(
      {
        currentPassword: values.current_password,
        newPassword: values.new_password,
        revokeOtherSessions: values.revoke_other_sessions,
      },
      {
        onSuccess: () => {
          toast.success('Password updated successfully');
          form.reset();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Password</CardTitle>
        <CardDescription>Update your account password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="revoke_other_sessions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Revoke other sessions</FormLabel>
                    <FormDescription>
                      Sign out from all other devices when changing password
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
