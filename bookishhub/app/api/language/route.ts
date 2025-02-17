import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createLanguageAssessmentSchema } from "@/app/form-validators/language";

export async function POST(request: Request, response: Response)
{
    try 
    {   
        const session = await getAuthSession();   

        if (!session?.user) 
        {
        return NextResponse.redirect("/");
        }

        const body = await request.json();
        const parsedData = createLanguageAssessmentSchema.parse(body);

        const newSession = await databaseClient.languageSession.create({
            data: {
                languageId: parseInt(parsedData.languageId),
                level: parsedData.level,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ sessionId: newSession.id });

        return NextResponse.json({ sessionId: newSession.id });
    } 
    catch (error) 
    {
        console.error("Error processing request:", error);
        if(error instanceof ZodError)
        {
            return new NextResponse("Incorrect body format", {status:400})
        }
        return new NextResponse("Internal server error", { status: 500 });
    }
}
