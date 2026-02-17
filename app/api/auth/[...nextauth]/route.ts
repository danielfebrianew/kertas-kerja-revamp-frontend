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
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.SITE_URL;
          const response = await fetch(`${apiUrl}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username,
              password
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.message || "Login failed");
          }

          const result = await response.json();

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
