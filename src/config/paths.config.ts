import { z } from 'zod';

const PathsSchema = z.object({
  auth: z.object({
    signIn: z.string().min(1),
    signUp: z.string().min(1),
    forgotPassword: z.string().min(1),
    resetPassword: z.string().min(1),
    twoFactor: z.string().min(1),
  }),
  app: z.object({
    home: z.string().min(1),
    account: z.string().min(1),
    security: z.string().min(1),
    preferences: z.string().min(1),
  }),
  admin: z.object({
    root: z.string().min(1),
    users: z.string().min(1),
  }),
  orgs: z.object({
    root: z.string().min(1),
    create: z.string().min(1),
  }),
});

type PathsConfig = z.infer<typeof PathsSchema> & {
  orgs: {
    detail: (slug: string) => string;
    members: (slug: string) => string;
    memberDetail: (slug: string, memberId: string) => string;
    invite: (slug: string) => string;
    invitations: (slug: string) => string;
    roles: (slug: string) => string;
    createRole: (slug: string) => string;
    editRole: (slug: string, roleId: string) => string;
    teams: (slug: string) => string;
    createTeam: (slug: string) => string;
    teamDetail: (slug: string, teamId: string) => string;
    settings: (slug: string) => string;
    acceptInvitation: (invitationId: string) => string;
  };
};

const pathsConfig: PathsConfig = {
  ...PathsSchema.parse({
    auth: {
      signIn: '/auth/sign-in',
      signUp: '/auth/sign-up',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      twoFactor: '/auth/two-factor',
    },
    app: {
      home: '/home',
      account: '/home/account',
      security: '/home/security',
      preferences: '/home/preferences',
    },
    admin: {
      root: '/admin',
      users: '/admin/users',
    },
    orgs: {
      root: '/orgs',
      create: '/orgs/create',
    },
  }),
  orgs: {
    root: '/orgs',
    create: '/orgs/create',
    detail: (slug: string) => `/orgs/${slug}`,
    members: (slug: string) => `/orgs/${slug}/members`,
    memberDetail: (slug: string, memberId: string) =>
      `/orgs/${slug}/members/${memberId}`,
    invite: (slug: string) => `/orgs/${slug}/invitations/create`,
    invitations: (slug: string) => `/orgs/${slug}/invitations`,
    roles: (slug: string) => `/orgs/${slug}/roles`,
    createRole: (slug: string) => `/orgs/${slug}/roles/create`,
    editRole: (slug: string, roleId: string) => `/orgs/${slug}/roles/${roleId}`,
    settings: (slug: string) => `/orgs/${slug}/settings`,
    acceptInvitation: (invitationId: string) => `/orgs/accept/${invitationId}`,
    teams: (slug: string) => `/orgs/${slug}/teams`,
    createTeam: (slug: string) => `/orgs/${slug}/teams/create`,
    teamDetail: (slug: string, teamId: string) => `/orgs/${slug}/teams/${teamId}`,
  },
};

export default pathsConfig;
