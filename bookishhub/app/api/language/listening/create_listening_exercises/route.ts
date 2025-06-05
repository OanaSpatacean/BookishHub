export const dynamic = 'force-dynamic';
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { createRephrasingSchema } from "@/app/form-validators/language";
import { strict_output } from "@/lib/openai";
import Replicate from "replicate";
import { uploadToS3Audios, getS3Url } from "@/lib/s3";
import { languageMap } from "../../pronunciation/check_pronunciation/route";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

async function generateAudio(text: string, languageCode: string) {
    const input = {
        text,
        speaker: "https://replicate.delivery/pbxt/Jt79w0xsT64R1JsiJ0LQRL8UcWspg5J4RFrU6YwEKpOT1ukS/male.wav",
        language: languageCode,
        cleanup_voice: false
    }

    try 
    {
        const response = await replicate.run(
            "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
            { input }
        )

        if (response instanceof ReadableStream) 
        {
            const reader = response.getReader();
            const chunks: Uint8Array[] = [];

            let done = false;

            while (!done) 
            {
                const { value, done: readerDone } = await reader.read();

                if (value) 
                    chunks.push(value);

                done = readerDone;
            }

            const blob = new Blob(chunks, { type: "audio/wav" });
            const audioBuffer = Buffer.from(await blob.arrayBuffer());
            const file = new File([audioBuffer], `${text.replace(/\s+/g, "_")}.wav`, { type: "audio/wav" });

            const { keyOfFile } = await uploadToS3Audios(file, text);
            const s3Url = getS3Url(keyOfFile);

            console.log("Uploaded Audio URL (S3):", s3Url);
            return s3Url;
        }

        throw new Error("Unexpected response format");
    } 
    catch (error) 
    {
        console.error("Error generating audio:", error);
        throw new Error("Failed to generate audio");
    }
}

export async function POST(request: Request) {
    try 
    {
        const session = await getAuthSession();

        if (!session?.user) 
        {
            return NextResponse.redirect(new URL("/", request.url));
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

        let languageCode = languageMap[language.name] || "en";
        const supportedLanguages = ["en", "es", "fr", "de", "it", "pt", "pl", "tr", "ru", "nl", "cs", "ar", "zh", "hu", "ko", "hi"];

        if (!supportedLanguages.includes(languageCode)) 
        {
            console.warn(`Language code "${languageCode}" is not supported by Replicate. Defaulting to English.`);
            languageCode = "en"; 
        }

        const listeningExercises = await strict_output(
            `Generate 5 different simple words or short phrases for the ${language.name} language at the ${level} level. 
            These words will be used for listening exercises.`,
            new Array(5).fill(`Provide a single word or short phrase.`),
            { phrase: "A simple word or phrase in the target language." }
        )

        console.log("Generated exercises:", listeningExercises);

        const exercisesWithAudio = await Promise.all(
            listeningExercises.map(async (exercise: { phrase: string }) => {
                const audioUrl = await generateAudio(exercise.phrase, languageCode);

                console.log("Audio URL:", audioUrl);

                if (typeof audioUrl !== "string") 
                {
                    throw new Error(`Invalid audio URL received: ${JSON.stringify(audioUrl)}`);
                }

                return {
                    audioUrl,
                    correctText: exercise.phrase,
                    userAnswer: "",
                    sessionId: languageSession.id
                }
            })
        )

        console.log("Exercises with Audio:", exercisesWithAudio);

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
