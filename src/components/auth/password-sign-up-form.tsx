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
import appConfig from '@/config/app.config';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';
import { SignUpSchema, signUpSchema } from '@/validators/auth';

export function PasswordSignUpForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<SignUpSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          name: data.email.split('@')[0],
          email: data.email,
          password: data.password,
          callbackURL: appConfig.url + pathsConfig.app.home,
        },
        {
          onSuccess: () => {
            toast.success(
              'Account created successfully. Please check your email to verify your account.',
            );
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
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
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  );
}
