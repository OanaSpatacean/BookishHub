export const dynamic = 'force-dynamic';
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createRephrasingSchema } from "@/app/form-validators/language";
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
        const parsedData = createRephrasingSchema.parse(body);

        const languageId = parseInt(parsedData.languageId);
        const languageSessionId = parseInt(parsedData.languageSessionId);
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

        if (!language) 
        {
            return new NextResponse("Language not found", { status: 404 });
        }

        const languageSession = await databaseClient.languageSession.findFirst({
            where: 
            { 
                id: languageSessionId 
            }
        })

        if (!languageSession) 
        {
            return new NextResponse("No existing session found", { status: 404 });
        }

        const existingWords = await databaseClient.pronunciationWord.findMany({
            where: 
            { 
                sessionId: languageSession.id 
            }
        })

        if (existingWords.length > 0) 
        {
            return NextResponse.json({ sessionId: languageSession.id, words: existingWords });
        }

        const words: { word: string }[] = await strict_output(
            `You are an AI generating 5 different words in the ${language.name} language for a ${level} level learner.`,
            new Array(5).fill(
                `Provide a single word in ${language.name} appropriate for a ${level} level learner.`
            ),
            {
                word: "A single word in the given language",
            }
        )

        await databaseClient.pronunciationWord.createMany({
            data: words.map((w) => ({
                word: w.word,
                sessionId: languageSession.id
            }))
        })

        return NextResponse.json({ sessionId: languageSession.id, words });
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
