'use client';

import { useRouter } from 'next/navigation';

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
import { authClient } from '@/lib/auth-client';

const updateAccountFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type UpdateAccountFormValues = z.infer<typeof updateAccountFormSchema>;

export function UpdateAccountDetailsForm() {
  const router = useRouter();
  const form = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateAccountFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: UpdateAccountFormValues) => {
    await authClient.updateUser(
      {
        name: values.name,
      },
      {
        onSuccess: () => {
          toast.success('Account details updated successfully');
          form.reset();
          router.refresh();
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
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Update your account details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" type="text" />
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
              Update Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
