import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { updateAccountInfoSchema } from "@/app/form-validators/user";
import bcrypt from "bcryptjs";

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

        const user = await databaseClient.user.findUnique({
            where: 
            { 
                id: session.user.id 
            }
        })

        if (!user) 
        {
            return new NextResponse("User not found", { status: 404 });
        }

        let updatedData: any = {};

        if (parsedBody.name) 
        {
            updatedData.name = parsedBody.name;
        }

        if (parsedBody.password && parsedBody.oldPassword) 
        {
            if (!user.password) 
            {
                return new NextResponse("No password set for this user", { status: 400 });
            }

            const isPasswordValid = await bcrypt.compare(parsedBody.oldPassword, user.password);

            if (!isPasswordValid) 
            {
                return new NextResponse("Current password is incorrect", { status: 400 });
            }

            updatedData.password = await bcrypt.hash(parsedBody.password, 10);
        }

        if (Object.keys(updatedData).length > 0) 
        {
            await databaseClient.user.update({
                where: 
                { 
                    id: session.user.id 
                },
                data: updatedData
            })
        }

        return NextResponse.json({ success: true, message: "Account updated successfully" });
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