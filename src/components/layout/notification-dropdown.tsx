'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const notifications = [
  {
    id: '1',
    title: 'New order received',
    description: 'Order #1234 has been placed',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Payment confirmed',
    description: 'Payment for order #1233 received',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Low stock alert',
    description: 'Product SKU-001 is running low',
    time: '3 hours ago',
    read: true,
  },
];

export function NotificationDropdown() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon-sm" variant="ghost" className="relative size-7">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px]">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-medium">Notifications</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center p-6">
              <p className="text-muted-foreground text-sm">No notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className="hover:bg-muted/50 flex flex-col gap-1 p-4 text-left transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read && (
                      <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {notification.description}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {notification.time}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
