'use server';

import { updateTag } from 'next/cache';

import { z } from 'zod';

import { auth } from '@/lib/auth';
import { actionContext, oa } from '@/orpc/middlewares';
import { onSuccess } from '@orpc/server';

export const updateOrganizationLogoAction = oa
  .input(
    z.object({
      organizationId: z.string().min(1),
      slug: z.string().min(1),
      logo: z.string(),
    }),
  )
  .handler(async ({ input, context }) => {
    await auth.api.updateOrganization({
      headers: context.headers,
      body: {
        organizationId: input.organizationId,
        data: {
          logo: input.logo,
        },
      },
    });

    return { input };

  })
  .actionable({
    context: actionContext,
    interceptors: [
      onSuccess(async ({ input }) => {
        updateTag(`organization-${input.slug}`);
        updateTag('organizations');
      }),
    ]
  });
