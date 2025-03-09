import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createRephrasingSchema } from "@/app/form-validators/language";
import { strict_output } from "@/lib/openai";

type Question = {
    question: string;
    answer: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
};

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

        const existingQuestions = await databaseClient.reading.findMany({
            where: 
            {
                sessionId: languageSession.id
            }
        })

        if (existingQuestions.length > 0) 
        {
            return NextResponse.json({ sessionId: languageSession.id, questions: existingQuestions });
        }

        const generatedTextObject = await strict_output(
            `You are an AI generating educational reading texts for ${language?.name} learners at the ${level} level.
            Create a short but informative passage on a relevant topic for learners at this level.`,
            [`Generate a reading passage of 1000 words or more words for learners at the ${level} level in ${language?.name}.`],
            { text: "A short passage with a coherent topic, engaging for learners." }
        )
        
        if (!generatedTextObject || !Array.isArray(generatedTextObject) || generatedTextObject.length === 0) 
        {
            throw new Error("Failed to generate text. AI response is empty.");
        }
        
        const generatedText = generatedTextObject[0]?.text || "Default fallback text";
        
        const newReading = await databaseClient.reading.create({
            data: 
            {
                text: generatedText || "Default fallback text",
                question: "",
                answer: "",
                userAnswer: "",
                choices: "[]",
                sessionId: languageSession.id
            }
        })        

        const generatedQuestions: Question[] = await strict_output(
            `You are an AI generating multiple-choice reading comprehension questions for a text in ${language?.name}.
            Create 5 questions based on the following passage: "${generatedText}"`,
            new Array(5).fill(
                `Generate a reading comprehension question based on the passage.`
            ),
            {
                question: "A comprehension question about the passage",
                answer: "Correct answer, based strictly on the text",
                choice1: "Incorrect but plausible answer",
                choice2: "Another incorrect but plausible answer",
                choice3: "Another incorrect answer",
                choice4: "Could also be 'None of the above' or 'All of the above'"
            }
        )

        await databaseClient.reading.update({
            where: 
            { 
                id: newReading.id 
            },
            data: 
            {
                question: generatedQuestions.map(q => q.question).join("\n\n"),
                answer: generatedQuestions.map(q => q.answer).join("\n\n"),
                choices: JSON.stringify(
                    generatedQuestions.map(q => [
                        q.answer, q.choice1, q.choice2, q.choice3, q.choice4
                    ])
                )
            }
        })

        return NextResponse.json({ sessionId: languageSession.id, readingId: newReading.id });
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
