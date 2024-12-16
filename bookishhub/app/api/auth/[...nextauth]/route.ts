import { authenticationOptions } from "@/lib/authentication"
import NextAuth from "next-auth/next"

const authHandler = NextAuth(authenticationOptions);

export {authHandler as GET, authHandler as POST, authHandler as PUT, authHandler as DELETE};
