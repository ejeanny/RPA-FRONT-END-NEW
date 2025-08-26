import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import jwt from "jsonwebtoken";
import { log } from "console";

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
    async jwt({ token, account }) {
      // Persist tokens after sign in
      if (account) {
        if (account.access_token) {
          (token as any).accessToken = account.access_token;
        }
        if (account.id_token) {
          log("account.id_token", account.id_token);
          const decoded: any = jwt.decode(account.id_token);
          if (decoded?.roles) {
            (token as any).roles = decoded.roles as string[];
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      if (session.user && Array.isArray((token as any).roles)) {
        (session.user as User).roles = (token as any).roles;
        (session.user as User).isAdmin = (token as any).roles.includes(
          process.env.AZURE_ADMIN_ROLE_ID as string
        );
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
