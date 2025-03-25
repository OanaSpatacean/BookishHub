import { databaseClient } from "@/lib/database";
import { NextResponse } from "next/server";

const verificationTokens: Record<string, { email: string; expiresAt: number }> = {};

export async function GET(request: Request) {
    try 
    {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token || !verificationTokens[token]) 
        {
            return new NextResponse('Invalid or expired token.', { status: 400 });
        }

        const { email, expiresAt } = verificationTokens[token];

        if (expiresAt < Date.now()) 
        {
            return new NextResponse('Token expired.', { status: 400 });
        }

        await databaseClient.user.update({
            where: { email },
            data: { emailVerified: new Date() },
        });

        delete verificationTokens[token];

        return NextResponse.json({ success: true, message: "Email verified successfully!" });
    } 
    catch (error) 
    {
        console.error('Error verifying email:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
