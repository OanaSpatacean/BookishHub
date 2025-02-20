import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createLanguageAssessmentSchema } from "@/app/form-validators/language";
import { strict_output } from "@/lib/openai";

type GrammarQuestion = 
{
    question: string;
    answer: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
}

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

        const grammarQuestions: GrammarQuestion[] = await strict_output(
            `You are an AI used for creating 4 multiple-choice questions related to the grammar of the ${language.name} language at the ${level} level. 
            Each solution should not have a length greater than 20 words.`,
            new Array(10).fill(
                `Your task is to create multiple-choice grammar questions for the ${language.name} language at the ${level} level.`
            ),
            {
                question: "question",
                answer: "answer with length of 20 words maximum, could also be 'All of the above'",
                choice1: "choice1 with length of 20 words maximum, different than the other choices",
                choice2: "choice2 with length of 20 words maximum, different than the other choices",
                choice3: "choice3 with length of 20 words maximum, different than the other choices",
                choice4: "choice4 with length of 20 words maximum, could also be 'All of the above', different than the other choices",
            }
        )

        const newSession = await databaseClient.languageSession.create({
            data: {
                languageId: parseInt(parsedData.languageId),
                level: parsedData.level,
                userId: session.user.id
            }
        })

        await databaseClient.grammarQuestion.createMany({
            data: grammarQuestions.map((grammarQuestion) => {
                let choices = [
                    grammarQuestion.answer,
                    grammarQuestion.choice1,
                    grammarQuestion.choice2,
                    grammarQuestion.choice3,
                    grammarQuestion.choice4,
                ];

                choices = choices.sort(() => Math.random() - 0.5);

                return {
                    question: grammarQuestion.question,
                    answer: grammarQuestion.answer,
                    choices: JSON.stringify(choices),
                    sessionId: newSession.id, 
                }
            })
        })

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
