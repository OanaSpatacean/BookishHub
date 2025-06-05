export const dynamic = 'force-dynamic';
import { databaseClient } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try 
    {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) 
        {
            return new NextResponse('Invalid or expired token.', { status: 400 });
        }

        const tokenRecord = await databaseClient.verificationToken.findUnique({
            where: 
            { 
                token 
            }
        })

        if (!tokenRecord) 
        {
            return new NextResponse('Invalid or expired token.', { status: 400 });
        }

        if (tokenRecord.expiresAt < new Date()) {
            await databaseClient.verificationToken.delete({
                where: 
                { 
                    token 
                }
            })
            return new NextResponse('Token expired.', { status: 400 });
        }

        await databaseClient.user.update({
            where: 
            { 
                email: tokenRecord.email 
            },
            data: 
            { 
                emailVerified: new Date() 
            }
        })

        await databaseClient.verificationToken.delete({
            where: 
            { 
                token 
            }
        })

        return NextResponse.json({ success: true, message: "Email verified successfully!" });
    } 
    catch (error) 
    {
        console.error('Error verifying email:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
