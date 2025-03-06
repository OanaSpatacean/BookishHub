import openai from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const correctWord = formData.get("word") as string;

    if (!file || !correctWord) 
    {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    try 
    {
        const audioBuffer = Buffer.from(await file.arrayBuffer());

        const audioFile = new File([audioBuffer], file.name, { type: file.type });

        const transcription = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: audioFile, 
            language: "ro"
        })

        const transcribedText = transcription.text.trim().toLowerCase();
        const isCorrect = transcribedText === correctWord.toLowerCase();

        return NextResponse.json({ isCorrect, transcribedText });
    } 
    catch (error) 
    {
        console.error("Error processing audio:", error);
        return NextResponse.json({ error: "Failed to analyze speech" }, { status: 500 });
    }
}
