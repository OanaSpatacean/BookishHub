import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createLanguageAssessmentSchema } from "@/app/form-validators/language";
import { strict_output } from "@/lib/openai";

export async function POST(request: Request, response: Response) {
    try 
    {
        const session = await getAuthSession();

        if (!session?.user) 
        {
            return NextResponse.redirect("/");
        }

        const body = await request.json();
        const parsedData = createLanguageAssessmentSchema.parse(body);

        const languageId = parseInt(parsedData.languageId);
        const level = parsedData.level;

        const language = await databaseClient.language.findUnique({
            where: 
            { 
                id: languageId 
            },
            select: 
            { 
                name: true 
            }
        })

        const languageSession = await databaseClient.languageSession.findFirst({
            where: 
            {
                languageId: languageId,
                level: level,
                userId: session.user.id, 
            },
            select: 
            { 
                id: true 
            }
        })
        
        if (!languageSession) 
        {
            return new NextResponse("No existing session found", { status: 404 });
        }
        

        const rephrasingQuestions: { phrase: string; answer: string }[] = await strict_output(
            `You are an AI that creates rephrasing exercises for the ${language.name} language at the ${level} level.
            Each phrase should be reworded while maintaining its original meaning.`,
            new Array(5).fill(
                `Generate a phrase and its correctly reworded version for the ${language.name} language at the ${level} level.`
            ),
            {
                phrase: "An original phrase that needs to be rephrased.",
                answer: "A correct reworded version of the phrase.",
            }
        )

        await databaseClient.rephrasingQuestion.createMany({
            data: rephrasingQuestions.map((rephrasingQuestion) => ({
                phrase: rephrasingQuestion.phrase,
                answer: rephrasingQuestion.answer,
                sessionId: languageSession.id,
            }))
        });

        return NextResponse.json({ sessionId: languageSession.id });
    } 
    catch (error) 
    {
        console.error("Error processing request:", error);

        if (error instanceof ZodError) 
        {
            return new NextResponse("Incorrect body format", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}
