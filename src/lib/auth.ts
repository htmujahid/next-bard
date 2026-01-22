import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, openAPI, organization, twoFactor } from 'better-auth/plugins';

import appConfig from '@/config/app.config';
import authConfig from '@/config/auth.config';
import pathsConfig from '@/config/paths.config';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { sendMail } from '@/lib/mailer';
import { ac, allRoles } from '@/lib/admin';
import { oc, allRoles as organizationRoles } from '@/lib/organization';

export const auth = betterAuth({
  authConfig,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: 'Reset Password',
        html: `
          <p>Hi ${user.name},</p>
          <p>Click <a href="${url}">here</a> to reset your password</p>
          <p>Or copy and paste the link below into your browser:</p>
          <p>${url}</p>
        `,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      requireVerification: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendMail({
          to: user.email,
          subject: 'Change Email',
          html: `
            <p>Hi ${user.name},</p>
            <p>Click <a href="${url}">here</a> to change your email to ${newEmail}</p>
            <p>Or copy and paste the link below into your browser:</p>
            <p>${url}</p>
          `,
        });
      },
    },
    deleteUser: {
      enabled: true,
      deleteSessions: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: 'Delete Account',
          html: `
            <p>Hi ${user.name},</p>
            <p>Click <a href="${url}">here</a> to delete your account</p>
            <p>Or copy and paste the link below into your browser:</p>
            <p>${url}</p>
          `,
        });
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: 'Verify Email',
        html: `
          <p>Hi ${user.name},</p>
          <p>Click <a href="${url}">here</a> to verify your email</p>
          <p>Or copy and paste the link below into your browser:</p>
          <p>${url}</p>
        `,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  plugins: [
    admin({
      ac,
      roles: allRoles,
    }),
    organization({
      ac: oc,
      dynamicAccessControl: {
        enabled: true,
      },
      teams: {
        enabled: true,
      },
      roles: organizationRoles,
      async sendInvitationEmail(data) {
        const inviteLink = `${appConfig.url}${pathsConfig.orgs.acceptInvitation(data.id)}`;
        await sendMail({
          to: data.email,
          subject: `You've been invited to join ${data.organization.name}`,
          html: `
            <p>Hi,</p>
            <p><strong>${data.inviter.user.name}</strong> (${data.inviter.user.email}) has invited you to join <strong>${data.organization.name}</strong> on ${appConfig.name}.</p>
            <p>Click <a href="${inviteLink}">here</a> to accept the invitation.</p>
            <p>Or copy and paste the link below into your browser:</p>
            <p>${inviteLink}</p>
            <p>This invitation will expire in 48 hours.</p>
          `,
        });
      },
    }),
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await sendMail({
            to: user.email,
            subject: 'OTP',
            html: `
              <p>Hi ${user.name},</p>
              <p>Your OTP is ${otp}</p>
            `,
          });
        },
      },
    }),
    openAPI({}),
  ],
});
