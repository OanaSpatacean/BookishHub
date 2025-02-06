import { databaseClient } from "@/lib/database";
import { ZodError, z } from "zod";
import { NextResponse } from "next/server";
import { deleteUserSchema, updateAccountInfoSchema } from "@/app/form-validators/user";

export async function PUT(request: Request, response: Response) 
{
    try 
    {
        const body = await request.json();
        const parsedBody = updateAccountInfoSchema.parse(body);

        const user = await databaseClient.user.update(
        {
            where: 
            { 
                id: parsedBody.id 
            },
            data: 
            {
                name: parsedBody.name ?? undefined,
                password: parsedBody.password ?? undefined,
            }
        });

        return NextResponse.json({ success: true, user });
    } 
    catch (error) 
    {
        console.error("Error updating account:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Invalid request body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function DELETE(request: Request, response: Response) 
{
    try 
    {
        const body = await request.json();
        const parsedBody = deleteUserSchema.parse(body);

        await databaseClient.user.delete(
        {
            where: 
            { 
                id: parsedBody.id 
            }
        });

        return NextResponse.json({ success: true, message: "Account deleted successfully" });
    } 
    catch (error) 
    {
        console.error("Error deleting account:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Invalid request body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}