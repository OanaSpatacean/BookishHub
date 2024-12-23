import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, DefaultSession } from "next-auth";
import { databaseClient } from "./database";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

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
        },
        redirect: async ({ url, baseUrl }) => {
            return baseUrl + '/';
        },
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
        CredentialsProvider(
        {
            name: "Credentials",
            credentials: 
            {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) 
            {
                if (!credentials?.email || !credentials?.password) 
                {
                    throw new Error("Email and Password are required");
                }

                const user = await databaseClient.user.findUnique(
                {
                    where: { email: credentials.email },
                });

                if (!user || !user.password) 
                {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) 
                {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    points: user.points,
                    isAdmin: user.isAdmin,
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
};

export const getAuthSession = async () => {
    const session = await getServerSession(authenticationOptions);

    if (!session) 
    {
        const token = cookies().get('next-auth.session-token')?.value;

        if (token) 
        {
            try 
            {
                const user = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
                return { user }; 
            } 
            catch (error) 
            {
                console.error('Invalid token:', error);
            }
        }

        return null;
    }

    return session;
}

