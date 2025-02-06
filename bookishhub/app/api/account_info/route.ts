import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { updateAccountInfoSchema } from "@/app/form-validators/user";

export async function PUT(request: Request, response: Response) 
{
    try 
    {
        const session = await getAuthSession();
        
        if (!session?.user) 
        {
            return new NextResponse("Unauthorized", { status: 401 });
        }

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
        const session = await getAuthSession();

        if (!session?.user) 
        {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await databaseClient.user.delete({
            where: 
            { 
                id: session.user.id 
            }
        })

        return NextResponse.json({ success: true, message: "Account deleted successfully" });
    } 
    catch (error) 
    {
        console.error("Error deleting account:", error);

        return new NextResponse("Internal server error", { status: 500 });
    }
}