import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config. This file must NOT import Prisma or bcrypt —
 * middleware.ts runs on the Edge runtime, which can't execute either.
 * The actual Credentials provider (with DB + password checks) lives in
 * auth.ts and only runs in the Node.js runtime (API routes, server actions,
 * server components).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [], // real provider is added in auth.ts
  callbacks: {
    authorized: async ({ auth }) => Boolean(auth?.user),
    jwt: async ({ token, user }) => {
      if (user) token.id = (user as { id?: string }).id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
};
