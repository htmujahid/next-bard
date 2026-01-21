'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AlertTriangle, Mail, Shield, Smartphone, User } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/home/account', label: 'Profile', icon: User, exact: true },
  { to: '/home/account/email', label: 'Email', icon: Mail },
  { to: '/home/account/security', label: 'Security', icon: Shield },
  { to: '/home/account/two-factor', label: 'Two-Factor', icon: Smartphone },
  {
    to: '/home/account/danger-zone',
    label: 'Danger Zone',
    icon: AlertTriangle,
  },
];

interface AccountNavProps {
  direction?: 'horizontal' | 'vertical';
}

export function AccountNav({ direction = 'vertical' }: AccountNavProps) {
  const pathname = usePathname();

  const navContent = (
    <nav
      className={cn(
        'flex gap-1',
        direction === 'horizontal' ? 'flex-row whitespace-nowrap' : 'flex-col',
      )}
    >
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.to
          : pathname.startsWith(item.to);

        return (
          <Link
            key={item.to}
            href={item.to}
            className={cn(
              buttonVariants({
                variant: isActive ? 'outline' : 'ghost',
                size: 'sm',
              }),
              direction === 'horizontal'
                ? 'shrink-0 gap-1.5'
                : 'justify-start gap-2',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  if (direction === 'horizontal') {
    return (
      <ScrollArea className="w-full whitespace-nowrap">
        {navContent}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  return navContent;
}
