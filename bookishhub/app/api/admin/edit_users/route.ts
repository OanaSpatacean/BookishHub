import { databaseClient } from "@/lib/database";
import { ZodError, z } from "zod";
import { NextResponse } from "next/server";
import { createUserSchema, deleteUserSchema, updateUserSchema } from "@/app/form-validators/user";

export async function POST(request: Request, response: Response) 
{
    try 
    {
        const body = await request.json();
        const parsedBody = createUserSchema.parse(body);

        const user = await databaseClient.user.create({
            data: {
                name: parsedBody.name ?? null,
                email: parsedBody.email,
                image: parsedBody.image ?? null,
                points: parsedBody.points ?? 10, 
                isAdmin: parsedBody.isAdmin ?? false
            }
        })

        return NextResponse.json({ success: true, user });
    } 
    catch (error) 
    {
        console.error("Error creating user:", error);
        if (error instanceof ZodError) {
            return new NextResponse("Invalid request body format", { status: 400 });
        }
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function PUT(request: Request, response: Response) {
    try {
        const body = await request.json();
        const parsedBody = updateUserSchema.parse(body);

        const user = await databaseClient.user.update({
            where: { id: parsedBody.id },
            data: {
                name: parsedBody.name ?? undefined,
                points: parsedBody.points ?? undefined,
                isAdmin: parsedBody.isAdmin ?? undefined
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error updating user:", error);
        if (error instanceof ZodError) {
            return new NextResponse("Invalid request body format", { status: 400 });
        }
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function DELETE(request: Request, response: Response) {
    try {
        const body = await request.json();
        const parsedBody = deleteUserSchema.parse(body);

        await databaseClient.user.delete({
            where: { id: parsedBody.id }
        });

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        if (error instanceof ZodError) {
            return new NextResponse("Invalid request body format", { status: 400 });
        }
        return new NextResponse("Internal server error", { status: 500 });
    }
}