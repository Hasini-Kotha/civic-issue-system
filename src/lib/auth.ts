import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  session: { strategy: "jwt" as const },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || user.role !== "ADMIN") return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: { role?: string } }) {
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: { user?: { id?: string; role?: string }; expires?: string };
      token: Record<string, unknown>;
    }) {
      if (session.user) {
        session.user.id = (token.sub as string | undefined) ?? "";
        session.user.role = (token.role as string | undefined) ?? "USER";
      }
      return session;
    },
  },
};
