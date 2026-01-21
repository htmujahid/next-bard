'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function OrganizationSwitcher() {
  const router = useRouter();
  const { data: organizations, isPending: isLoadingOrgs } =
    authClient.useListOrganizations();
  const { data: activeOrg, isPending: isLoadingActiveOrg } =
    authClient.useActiveOrganization();

  const handleSelectOrganization = async (orgId: string) => {
    await authClient.organization.setActive(
      { organizationId: orgId },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  const isLoading = isLoadingOrgs || isLoadingActiveOrg;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : activeOrg ? (
            <div className="flex items-center gap-2 truncate">
              <Avatar className="h-5 w-5">
                {activeOrg.logo && <AvatarImage src={activeOrg.logo} />}
                <AvatarFallback className="text-xs">
                  {activeOrg.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{activeOrg.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Select organization</span>
            </div>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {organizations?.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.name}
                  onSelect={() => handleSelectOrganization(org.id)}
                  className="cursor-pointer"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    {org.logo && <AvatarImage src={org.logo} />}
                    <AvatarFallback className="text-xs">
                      {org.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{org.name}</span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      activeOrg?.id === org.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem asChild>
                <Link
                  href={pathsConfig.orgs.create}
                  className="flex cursor-pointer items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
