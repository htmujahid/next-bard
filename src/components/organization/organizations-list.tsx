'use client';

import * as React from 'react';

import Link from 'next/link';

import { ArrowRight, Building2, Plus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import pathsConfig from '@/config/paths.config';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

interface OrganizationsListProps {
  promises: Promise<Organization[]>;
}

export function OrganizationsList({ promises }: OrganizationsListProps) {
  const organizations = React.use(promises);

  if (organizations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No organizations yet</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Create your first organization to start collaborating with your
            team.
          </p>
          <Button asChild>
            <Link href={pathsConfig.orgs.create}>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <Card key={org.id} className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="h-12 w-12">
              {org.logo && <AvatarImage src={org.logo} />}
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">{org.name}</CardTitle>
              <CardDescription className="truncate">
                /{org.slug}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={pathsConfig.orgs.detail(org.slug)}>
                View Organization
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
