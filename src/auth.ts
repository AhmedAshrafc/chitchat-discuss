import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
// Regarding "PrismaAdapter": Whenever a user signs in to our app, we want to store some information about them in our database.
// List of all the users we have, what their usernames are, their avatar posted on GitHub, and so on.
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth client ID or secret");
}

export const {
  // This 'handlers' will be called automatically by GitHub servers whenever a user tries to sign in to our app.
  handlers: { GET, POST },
  // This 'auth' will be used to determine whether a user is signed in or not.
  auth,
  signOut,
  signIn,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // This callback is called whenever we wanna verify who a user is in our application.
    // In a normal NextAuth project, you usually not need this, here we are fixing a bug in nextauth.
    async session({ session, user }: any) {
      if (session && user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
