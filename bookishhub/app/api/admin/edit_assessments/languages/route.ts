import { databaseClient } from "@/lib/database";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { createLanguageSchema, updateLanguageSchema, deleteLanguageSchema } from "@/app/form-validators/language";

export async function POST(request: Request) {
    try 
    {
        const body = await request.json();
        const parsedBody = createLanguageSchema.parse(body);

        const language = await databaseClient.language.create({
            data: {
                name: parsedBody.name
            }
        })

        return NextResponse.json({ success: true, language });
    } 
    catch (error) 
    {
        console.error("Error creating language:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Invalid request body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function PUT(request: Request) {
    try 
    {
        const body = await request.json();
        const parsedBody = updateLanguageSchema.parse(body);

        const language = await databaseClient.language.update({
            where: 
            { 
                id: parsedBody.id 
            },
            data: 
            { 
                name: parsedBody.name ?? undefined 
            }
        })

        return NextResponse.json({ success: true, language });
    } 
    catch (error) 
    {
        console.error("Error updating language:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Invalid request body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try 
    {
        const body = await request.json();
        const parsedBody = deleteLanguageSchema.parse(body);

        await databaseClient.language.delete({
            where: { 
                id: parsedBody.id 
            }
        })

        return NextResponse.json({ success: true, message: "Language deleted successfully" });
    } 
    catch (error) 
    {
        console.error("Error deleting language:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Invalid request body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function GET() {
    try 
    {
        const languages = await databaseClient.language.findMany();

        return NextResponse.json({ success: true, languages });
    } 
    catch (error) {
        console.error("Error fetching languages:", error);
        
        return new NextResponse("Internal server error", { status: 500 });
    }
}
