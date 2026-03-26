// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials;

        try {
          const { fetchApi } = await import('@/lib/fetcher');
          const apiResponse = await fetchApi({
            url: "/user/login",
            method: "POST",
            type: "withoutAuth",
            body: { username, password }
          });

          if (apiResponse.status !== 200 && apiResponse.status !== 201) {
            throw new Error(apiResponse.data?.message || apiResponse.message || "Login failed");
          }

          const result = apiResponse.data;

          // Response dari backend: { data: { token: "jwt_token" } }
          if (result.data?.token) {
            // Decode JWT untuk mendapatkan user info
            const token = result.data.token;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const userPayload = JSON.parse(jsonPayload);

            return {
              id: userPayload.user_id?.toString() || username,
              email: userPayload.email,
              accessToken: token,
              user: userPayload
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user;
      }

      return token;
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.user = token.user;

      return session;
    }
  },

  pages: {
    signIn: "/"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
