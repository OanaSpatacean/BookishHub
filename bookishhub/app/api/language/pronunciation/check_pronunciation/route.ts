import openai from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { getS3Url, uploadToS3Audios } from "@/lib/s3";
import { databaseClient } from "@/lib/database";
import { languageMap } from "@/components/Pronunciation";

export const languageMap: Record<string, string> = {
  Romanian: "ro",
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Italian: "it",
  Portuguese: "pt",
  Polish: "pl",
  Turkish: "tr",
  Russian: "ru",
  Dutch: "nl",
  Czech: "cs",
  Arabic: "ar",
  Chinese: "zh",
  Hungarian: "hu",
  Korean: "ko",
  Hindi: "hi"
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const correctWord = formData.get("word") as string;
  const languageName = formData.get("language") as string;

  if (!file || !correctWord) 
    {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const languageCode = languageMap[languageName] || "en";

  try 
  {
    const { keyOfFile, nameOfFile } = await uploadToS3Audios(file, correctWord);    
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

    const updatedPronunciationWord = await databaseClient.pronunciationWord.updateMany({
        where: 
        {
          word: correctWord,
        },
        data: 
        {
          recordingUrl: s3Url
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
