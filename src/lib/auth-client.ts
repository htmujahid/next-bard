import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from './auth';
import { ac, allRoles } from './admin';
import { oc, allRoles as organizationRoles } from './organization';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: allRoles,
    }),
    organizationClient({
      ac: oc,
      dynamicAccessControl: {
        enabled: true,
      },
      teams: {
        enabled: true,
      },
      roles: organizationRoles,
    }),
    twoFactorClient(),
  ],
});
