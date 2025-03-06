import openai from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { getS3Url, uploadToS3 } from "@/lib/s3";
import { databaseClient } from "@/lib/database";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const correctWord = formData.get("word") as string;
  const languageName = formData.get("language") as string;

  if (!file || !correctWord) 
    {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const languageMap: Record<string, string> = {
    English: "en",
    French: "fr",
    Spanish: "es",
    German: "de",
    Italian: "it",
    Romanian: "ro",
    Portuguese: "pt",
    Russian: "ru",
    Chinese: "zh",
    Japanese: "ja",
    Korean: "ko",
    Arabic: "ar"
    }

  const languageCode = languageMap[languageName] || "en";

  try 
  {
    const { keyOfFile } = await uploadToS3(file);
    const s3Url = getS3Url(keyOfFile);

    const audioBuffer = Buffer.from(await file.arrayBuffer());

    const audioFile = new File([audioBuffer], file.name, { type: file.type });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      language: languageCode
    })

    const transcribedText = transcription.text.trim().toLowerCase();
    const isCorrect = transcribedText === correctWord.toLowerCase();

    const pronunciationRecord = await databaseClient.pronunciationWord.create({
      data: 
      {
        word: correctWord,
        recordingUrl: s3Url, 
        sessionId: 1
      }
    })

    return NextResponse.json({isCorrect, transcribedText, recordingUrl: s3Url})
  } 
  catch (error) 
  {
    console.error("Error processing audio:", error);
    return NextResponse.json({ error: "Failed to analyze speech" }, { status: 500 });
  }
}
