'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { ResetPasswordSchema, resetPasswordSchema } from '@/validators/auth';

export function ResetPasswordForm({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();

  const form = useForm<ResetPasswordSchema>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    startTransition(async () => {
      await authClient.resetPassword(
        {
          newPassword: data.password,
          token,
        },
        {
          onError: ({ error: err }) => {
            toast.error(err.message);
          },
          onSuccess: () => {
            toast.success('Password reset successfully');
          },
        },
      );
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  );
}
