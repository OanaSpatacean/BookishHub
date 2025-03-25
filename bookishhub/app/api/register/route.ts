import { databaseClient } from "@/lib/database";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { createUserSchema } from "@/app/form-validators/user";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const verificationTokens: Record<string, { email: string; expiresAt: number }> = {};

async function sendVerificationEmail(email: string, token: string) {
    const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

    const msg = {
        to: email,
        from: "oana.spatacean6a@gmail.com", 
        subject: "BookishHub - Confirm your email",
        html: `<p>Click <a href="${confirmationUrl}">here</a> to verify your email.</p>`,
    }

    await sgMail.send(msg)
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
