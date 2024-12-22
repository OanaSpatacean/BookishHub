import { databaseClient } from '@/lib/database';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { loginSchema } from '@/app/form-validators/user';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        const user = await databaseClient.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return new NextResponse('Invalid credentials', { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new NextResponse('Invalid credentials', { status: 401 });
        }

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Error logging in:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
