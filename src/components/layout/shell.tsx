import type * as React from 'react';

import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const shellVariants = cva('grid grid-cols-1 items-center gap-8 p-4', {
  variants: {
    variant: {
      default: '',
      sidebar: '',
      centered: 'flex h-dvh max-w-2xl flex-col justify-center py-16',
      markdown: 'max-w-3xl py-8 md:py-10 lg:py-10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ShellProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({
  className,
  as: Comp = 'section',
  variant,
  ...props
}: ShellProps) {
  return (
    <Comp className={cn(shellVariants({ variant }), className)} {...props} />
  );
}

export { Shell, shellVariants };
