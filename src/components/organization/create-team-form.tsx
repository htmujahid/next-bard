'use client';

import * as React from 'react';

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name must be less than 100 characters'),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

interface CreateTeamFormProps {
  organizationId: string;
  orgSlug: string;
}

export function CreateTeamForm({
  organizationId,
  orgSlug,
}: CreateTeamFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: CreateTeamFormValues) => {
    setIsSubmitting(true);
    await authClient.organization.createTeam(
      {
        name: values.name,
        organizationId,
      },
      {
        onSuccess: () => {
          toast.success('Team created successfully');
          form.reset();
          router.push(pathsConfig.orgs.teams(orgSlug));
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Team</CardTitle>
        <CardDescription>
          Create a new team to organize members within your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Engineering, Marketing, Design"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name for your team.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(pathsConfig.orgs.teams(orgSlug))}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Team'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
