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
            Provide an example sentence and its reworded version that maintains the same meaning.
            
            **Important:** The reworded version must **only** rearrange the words from the original sentence without adding or removing words. The meaning should remain unchanged, and the vocabulary should stay exactly the same.`,
            [`Generate an example phrase and its rephrased version for the ${language.name} language at the ${level} level.`],
            {
                phrase: "An example phrase that needs to be rephrased.",
                answer: "A correct reworded version of the example phrase.",
            }
        )
        
        const examplePhrase = exampleData[0]?.phrase || "This is a sample sentence for rephrasing.";
        const exampleAnswer = exampleData[0]?.answer || "This is the reworded version of the sample sentence.";
        
        const rephrasingQuestions = await strict_output(
            `You are an AI that creates rephrasing exercises for the ${language.name} language at the ${level} level.
            Create 4 rephrasing exercises that follow the structure of this example:
            
            **Example Phrase:** ${examplePhrase}
            **Example Answer:** ${exampleAnswer}
            
            **Rules for rephrasing:**
            - Use the **exact same words** as in the original sentence, but rearrange them in a different order.
            - The reworded sentence must keep the same meaning as the original.
            - Do **not** add new words, remove words, or replace words with synonyms.
            - The sentence should feel natural and grammatically correct in ${language.name}.
            
            Generate 4 phrases following these rules.`,
            new Array(5).fill(
                `Generate a phrase and its rephrased version for the ${language.name} language at the ${level} level.`
            ),
            {
                phrase: "An original phrase that needs to be rephrased.",
                answer: "A correct reworded version of the phrase that only rearranges the original words.",
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
