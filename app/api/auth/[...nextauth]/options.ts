import type { NextAuthOptions, Account, User as NextAuthUser, Profile, Session as NextAuthSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';
import jwt from 'jsonwebtoken';
import { log } from 'console';

interface User extends NextAuthUser {
  isAdmin?: boolean;
  roles?: string[];
}

export const options: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('jwt callback', { token, user }); // Log token and user
      // Persist the access_token to the token right after sign in
      if (account) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }
        if (account.id_token) {
          log('account.id_token', account.id_token);
          const decodedToken = jwt.decode(account.id_token) as any;
          token.roles = decodedToken.roles; // Add roles to token
        }
      }
      return token; // Return the token
    },
    async session({ session, token, user }) {
      console.log('session callback', { session, token, user }); // Log session, token, and user
      session.accessToken = token.accessToken;
      if (session.user && Array.isArray(token.roles)) {
        (session.user as User).roles = token.roles;
        (session.user as User).isAdmin = token.roles.includes(process.env.AZURE_ADMIN_ROLE_ID as string);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this matches your backend secret
};
