import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

// whenever a GET or POST request is made to /api/auth, it will call handler function to use next auth
export { handler as GET, handler as POST };
