import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) 
{
    const token = req.cookies.get('next-auth.session-token')?.value;

    if (token) 
    {
        try 
        {
            const user = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
            req.headers.set('x-user', JSON.stringify(user)); 
        } 
        catch (error) 
        {
            console.error('Invalid token:', error);
        }
    }

    return NextResponse.next();
}
