'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';
import { type Role, rolesData } from '@/lib/roles';

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface UpdateUserFormProps {
  userId: string;
  defaultValues: {
    name: string;
    role?: string;
  };
}

export function UpdateUserForm({ userId, defaultValues }: UpdateUserFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });

  const onSubmit = (values: UpdateUserFormValues) => {
    startTransition(async () => {
      // Update user name
      const { error: updateError } = await authClient.admin.updateUser({
        userId,
        data: {
          name: values.name,
        },
      });

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      // Update role if changed
      if (values.role !== defaultValues.role) {
        const { error: roleError } = await authClient.admin.setRole({
          userId,
          role: values.role as Role,
        });

        if (roleError) {
          toast.error(roleError.message);
          return;
        }
      }

      router.refresh();
      toast.success('User updated successfully');
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update User</CardTitle>
        <CardDescription>Update the user&apos;s information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesData.map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="capitalize"
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
