import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, DefaultSession } from "next-auth";
import { databaseClient } from "./database";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        points: number;
        isAdmin: boolean;
    }
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            points: number;
            isAdmin: boolean;
        } & DefaultSession['user'];
    }
}

export const authenticationOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    }, 
    callbacks: {
        session: ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.points = token.points;
                session.user.isAdmin = token.isAdmin; 
            }
            return session;
        },
        jwt: async ({ token }) => {
            const user_database = await databaseClient.user.findFirst({
                where: { email: token.email }
            });
    
            if (user_database) {
                token.id = user_database.id;
                token.points = user_database.points;
                token.isAdmin = user_database.isAdmin; 
            }
            return token;
        }
    },
    adapter: PrismaAdapter(databaseClient),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: 'select_account',  
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
};

export const getAuthSession = () => {
    return getServerSession(authenticationOptions);
}

export const getAllUsers = async () => {
    try {
        return await databaseClient.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                points: true,
                isAdmin: true,
                image: true,
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Could not fetch users.');
    }
}
