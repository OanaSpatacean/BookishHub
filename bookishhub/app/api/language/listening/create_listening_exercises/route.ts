import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createRephrasingSchema } from "@/app/form-validators/language";
import { strict_output } from "@/lib/openai";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

async function generateAudio(text) {
    const input = {
        text,
        embedding_scale: 1.5
    }
    
    try 
    {
        const output = await replicate.run(
            "adirik/styletts2:989cb5ea6d2401314eb30685740cb9f6fd1c9001b8940659b406f952837ab5ac",
            { input }
        )
        return output
    } 
    catch (error) 
    {
        console.error("Error generating audio:", error);
        throw new Error("Failed to generate audio");
    }
}

export async function POST(request) {
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
            return new NextResponse("Invalid language ID", { status: 400 });
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

        const existingExercises = await databaseClient.listeningExercise.findMany({
            where: 
            { 
                sessionId: languageSession.id 
            }
        })

        if (existingExercises.length > 0) 
        {
            return NextResponse.json({ sessionId: languageSession.id, exercises: existingExercises });
        }

        const listeningExercises = await strict_output(
            `Generate 5 simple words or short phrases for the ${language.name} language at the ${level} level. 
            These words will be used for listening exercises.`,
            new Array(5).fill(`Provide a single word or short phrase.`),
            { phrase: "A simple word or phrase in the target language." }
        )

        const exercisesWithAudio = await Promise.all(
            listeningExercises.map(async (exercise: { phrase: any; }) => {
                const audioUrl = await generateAudio(exercise.phrase);
                return {
                    audioUrl,
                    correctText: exercise.phrase,
                    userAnswer: "",
                    sessionId: languageSession.id
                }
            })
        )

        await databaseClient.listeningExercise.createMany({
            data: exercisesWithAudio
        })

        return NextResponse.json({ sessionId: languageSession.id, exercises: exercisesWithAudio });
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
