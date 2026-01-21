'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormLabel } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import appConfig from '@/config/app.config';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';
import { ForgotPasswordSchema, forgotPasswordSchema } from '@/validators/auth';

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordSchema>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: appConfig.url + pathsConfig.auth.resetPassword,
        },
        {
          onError: ({ error: err }) => {
            toast.error(err.message);
          },
          onSuccess: () => {
            toast.success('Check your inbox for the reset link');
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
