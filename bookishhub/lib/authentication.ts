import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, DefaultSession } from "next-auth";
import { databaseClient } from "./database";
import { getServerSession } from "next-auth/next";

declare module 'next-auth/jwt' {
    interface JWT {
        uid: string;
        points: number;
    }
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            uid: string;
            points: number;
        } & DefaultSession['user'];
    }
}

export const authenticationOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    }, 
    callbacks: {
        session: ({session, token}) => {
            if(token){
                session.user.uid = token.uid; 
                session.user.name = token.name; 
                session.user.email = token.email; 
                session.user.image = token.picture; 
                session.user.points = token.points;
            }
            return session;
        },
        jwt: async ({token}) => {
            const user_database = await databaseClient.userProfile.findFirst({
                where: { emailAddress: token.email
            }})
            if(user_database){
                token.uid = user_database.uid
                token.points = user_database.points
            }
            return token;
        }
    },
    adapter: PrismaAdapter(databaseClient),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
};

export const getAuthSession = () => {
    return getServerSession(authenticationOptions);
}
