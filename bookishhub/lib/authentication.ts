import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, DefaultSession } from "next-auth";
import { databaseClient } from "./database";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import { cookies } from "next/headers";
import jwt, { JwtPayload } from 'jsonwebtoken';

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

    if (session) {
        return session; 
    }

    const token = cookies().get('next-auth.session-token')?.value;

    if (token) 
    {
        try 
        {
            const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as JwtPayload & 
            {
                id: string;
                name?: string;
                email?: string;
                image?: string;
                isAdmin?: boolean;
                points?: number;
            };

            if (!decoded || typeof decoded === 'string') 
            {
                throw new Error('Token invalid.');
            }

            return {
                user: {
                id: decoded.id,
                name: decoded.name || null,
                email: decoded.email || null,
                image: decoded.image || null,
                isAdmin: decoded.isAdmin || false,
                points: decoded.points || 0,
                },
            };
        } 
        catch (error) 
        {
            console.error('Invalid JWT token:', error);
        }
    }

    return null; 
}

