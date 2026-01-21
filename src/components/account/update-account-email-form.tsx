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

const updateEmailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type UpdateEmailFormValues = z.infer<typeof updateEmailFormSchema>;

export function UpdateAccountEmailForm() {
  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: UpdateEmailFormValues) => {
    await authClient.changeEmail(
      {
        newEmail: values.email,
        callbackURL: appConfig.url + pathsConfig.app.account,
      },
      {
        onSuccess: () => {
          toast.success('Verification email sent');
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
        <CardTitle>Account Email</CardTitle>
        <CardDescription>Update your account email below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="m@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-fit"
            >
              Update Email
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
