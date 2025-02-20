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

        const existingQuestions = await databaseClient.rephrasingQuestion.findMany({
            where: 
            {
                sessionId: languageSession.id
            }
        })

        if (existingQuestions.length > 0) 
        {
            return NextResponse.json({ sessionId: languageSession.id, questions: existingQuestions });
        }
        
        const exampleData = await strict_output(
            `You are an AI that creates examples for rephrasing exercises in the ${language.name} language at the ${level} level.
            Provide an example sentence and its reworded version that maintains the same meaning.`,
            [`Generate an example phrase and its rephrased version for the ${language.name} language at the ${level} level.`],
            {
                phrase: "An example phrase that needs to be rephrased.",
                answer: "A correct reworded version of the example phrase."
            }
        )

        const examplePhrase = exampleData[0]?.phrase || "This is a sample sentence for rephrasing.";
        const exampleAnswer = exampleData[0]?.answer || "This is the reworded version of the sample sentence.";

        const rephrasingQuestions = await strict_output(
            `You are an AI that creates rephrasing exercises for the ${language.name} language at the ${level} level. 
            Follow the structure of the example provided below to create 4 rephrasing exercises. 
            **Important**: Do not use the example phrase or answer directly, but instead create new phrases that follow the same structure and logic of rephrasing (changing word order or structure while keeping the meaning and tone the same). 
            Example Phrase: ${examplePhrase} 
            Example Answer: ${exampleAnswer}`,
            new Array(5).fill(
                `Generate a phrase and its rephrased version for the ${language.name} language at the ${level} level.`
            ),
            {
                phrase: "An original phrase that needs to be rephrased.",
                answer: "A correct reworded version of the phrase without diacritics.",
                examplePhrase,
                exampleAnswer
            }
        )        

        await databaseClient.rephrasingQuestion.createMany({
            data: rephrasingQuestions.map((rephrasingQuestion) => ({
                phrase: rephrasingQuestion.phrase,
                answer: rephrasingQuestion.answer,
                examplePhrase: rephrasingQuestion.examplePhrase,
                exampleAnswer: rephrasingQuestion.exampleAnswer,
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
