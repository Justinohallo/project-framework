import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const allowedEmail = process.env.AUTH_USER_EMAIL;
const allowedPassword = process.env.AUTH_USER_PASSWORD;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * Middleware authorization: only allow requests with a valid session.
     * Unauthenticated requests will be redirected to `pages.signIn`.
     */
    authorized({ auth }) {
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;

        const envEmail = allowedEmail;
        const envPassword = allowedPassword;

        if (!envEmail || !envPassword) return null;

        const emailInput = credentials.email as string;
        const passwordInput = credentials.password as string;

        if (emailInput !== envEmail) return null;

        const isHashed =
          envPassword.startsWith("$2a$") || envPassword.startsWith("$2b$");
        let passwordValid = false;

        if (isHashed) {
          passwordValid = await bcrypt.compare(passwordInput, envPassword);
        } else {
          passwordValid = passwordInput === envPassword;
        }

        if (!passwordValid) return null;

        return {
          id: "owner",
          email: envEmail,
          name: "Owner",
        };
      },
    }),
  ],
});
