import { databaseClient } from "@/lib/database";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { createUserSchema } from "@/app/form-validators/user";
import nodemailer from "nodemailer";
import crypto from "crypto";

const verificationTokens: Record<string, { email: string; expiresAt: number }> = {};

async function sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  
            pass: process.env.EMAIL_PASS   
        }
    })

    const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirm Your Email",
        html: `<p>Click <a href="${confirmationUrl}">here</a> to verify your email.</p>`
    });
}

export async function POST(request: Request) {
    try 
    {
        const body = await request.json();
        const parsedBody = createUserSchema.parse(body);

        const existingUser = await databaseClient.user.findUnique({
            where: 
            { 
                email: parsedBody.email 
            }
        })

        if (existingUser) 
        {
            return new NextResponse('Email already in use.', { status: 400 });
        }

        const user = await databaseClient.user.create({
            data: {
                name: parsedBody.name ?? null,
                email: parsedBody.email,
                password: parsedBody.password ?? null,
                image: parsedBody.image ?? null,
                points: parsedBody.points ?? 20,
                isAdmin: parsedBody.isAdmin ?? false,
                emailVerified: null,
                accounts: 
                {
                    create: 
                    {
                        type: 'default', 
                        provider: 'local', 
                        providerAccountId: parsedBody.email, 
                        refresh_token: null,
                        access_token: null,
                        expires_at: null,
                        token_type: null,
                        scope: null,
                        id_token: null,
                        session_state: null,
                    }
                }
            }
        })

        const emailToken = crypto.randomBytes(32).toString('hex');
        verificationTokens[emailToken] = { email: user.email!, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };

        await sendVerificationEmail(user.email!, emailToken);

        return NextResponse.json({ success: true, message: "Check your email for verification." });
    } 
    catch (error) 
    {
        console.error('Error registering user:', error);

        if (error instanceof ZodError) 
        {
            return new NextResponse('Invalid request body format', { status: 400 });
        }

        return new NextResponse('Internal server error', { status: 500 });
    }
}
