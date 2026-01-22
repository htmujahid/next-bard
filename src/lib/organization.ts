import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, ownerAc, adminAc, memberAc } from 'better-auth/plugins/organization/access'

export const statement = {
    ...defaultStatements,
    task: ['create', 'read', 'update', 'delete'],
    // ac resource is required for dynamic access control (managing roles)
    ac: ['create', 'read', 'update', 'delete'],
} as const;

export type OrgPermissions = {
  [K in keyof typeof statement]?: readonly (typeof statement)[K][number][];
};

export const oc = createAccessControl(statement);

export const ownerRole = oc.newRole({
  ...ownerAc.statements,
  // Owner can manage roles
  ac: ['create', 'read', 'update', 'delete'],
  // Owner has full task permissions
  task: ['create', 'read', 'update', 'delete'],
});

export const adminRole = oc.newRole({
  ...adminAc.statements,
  // Admin can manage roles
  ac: ['create', 'read', 'update', 'delete'],
  // Admin has full task permissions
  task: ['create', 'read', 'update', 'delete'],
});

export const memberRole = oc.newRole({
  ...memberAc.statements,
  // Members can only read roles
  ac: ['read'],
  // Members can read tasks
  task: ['read'],
});

export const allRoles = {
  owner: ownerRole,
  admin: adminRole,
  member: memberRole,
} as const;