import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user.email.toLowerCase() === process.env.ADMIN_EMAIL) {
        console.log("This user is an admin:", user.email);
        return true;
      } else {
        console.log("This person tried to log in but is not an admin:", user.email);
        return true;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the dashboard after successful sign-in
      return baseUrl + "/dashboard";
    },
  },
  pages: {error: '/auth/error'},
});

export { handler as GET, handler as POST };
