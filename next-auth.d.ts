// src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  // What your app’s User looks like (what you return from your adapter/authorize)
  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    image?: string;
    role?: string;        // single role if you prefer
    roles?: string[];     // or multiple roles
  }

  interface Session {
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      fullName?: string;
      role?: string;
      roles?: string[];
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;         // NextAuth’s user id (subject)
    firstName?: string;
    lastName?: string;
    fullName?: string;
    role?: string;
    roles?: string[];
    accessToken?: string;
    email?: string;
    picture?: string;
    name?: string;
  }
}
