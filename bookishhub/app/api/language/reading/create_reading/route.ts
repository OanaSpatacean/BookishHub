export const dynamic = 'force-dynamic';
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createRephrasingSchema } from "@/app/form-validators/language";
import { strict_output } from "@/lib/openai";

type ReadingQuestion = {
    question: string;
    answer: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
}

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

        const existingText = await databaseClient.readingText.findMany({
            where: 
            {
                sessionId: languageSession.id
            }
        })

        if (existingText.length > 0) 
        {
            return NextResponse.json({ sessionId: languageSession.id, questions: existingText });
        }

        const existingQuestions = await databaseClient.readingQuestion.findMany({
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
            Create an informative long passage in minimum 5000 characters on a relevant topic for learners at this level.`,
            [`Generate a long reading passage of minimum 5000 characters for learners at the ${level} level in ${language?.name}.`],
            { text: "A short passage with a coherent topic, engaging for learners." }
        )
        
        if (!generatedTextObject || !Array.isArray(generatedTextObject) || generatedTextObject.length === 0) 
        {
            throw new Error("Failed to generate text. AI response is empty.");
        }

        const generatedText = generatedTextObject[0]?.text || "Default fallback text";

        const newReading = await databaseClient.readingText.create({
            data: 
            {
                text: generatedText || "Default fallback text",
                sessionId: languageSession.id
            }
        })  

        const readingQuestions: ReadingQuestion[] = await strict_output(
            `You are an AI generating multiple-choice reading comprehension questions for a text in ${language?.name} at the ${level} level.
            Create 4 different questions based on the following passage: "${generatedText}"`,
            new Array(5).fill(
                `Generate a reading comprehension question based on the passage in ${language?.name} language at the ${level} level.`
            ),
            {
                question: "A comprehension question about the passage",
                answer: "Correct answer, based strictly on the text",
                choice1: "Incorrect but plausible answer, different than the other choices",
                choice2: "Another incorrect but plausible answer, different than the other choices",
                choice3: "Another incorrect answer, different than the other choices",
                choice4: "Could also be 'None of the above' or 'All of the above'"
            }
        )

        await databaseClient.readingQuestion.createMany({
            data: readingQuestions.map((readingQuestion) => {
                let choices = [
                    readingQuestion.answer,
                    readingQuestion.choice1,
                    readingQuestion.choice2,
                    readingQuestion.choice3,
                    readingQuestion.choice4
                ];

                while (choices.length < 5) 
                {
                    choices.push(""); 
                }

                choices = choices.sort(() => Math.random() - 0.5);

                return {
                    question: readingQuestion.question,
                    answer: readingQuestion.answer,
                    userAnswer: "",
                    choices: JSON.stringify(choices),
                    sessionId: languageSession.id,
                    readingTextId: newReading.id
                };
            })
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
