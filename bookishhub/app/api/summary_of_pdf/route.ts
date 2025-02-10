import { databaseClient } from "@/lib/database";
import { strict_output } from "@/lib/openai";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { SummaryOfPDFSchema } from "@/app/form-validators/summary_of_pdf"

export async function POST(req: Request) {
  try 
  {
    const body = await req.json();
    const { fileId } = SummaryOfPDFSchema.parse(body);

    const file = await databaseClient.files.findUnique({
      where: 
      { 
        id: parseInt(fileId, 10)
      }
    })

    if (!file || !file.fileKey) 
    {
      return NextResponse.json(
        { error: "File not found or missing fileKey" },
        { status: 404 }
      )
    }

    const fileKey = file.fileKey;

    const systemPrompt = `
      You are an AI assistant that creates structured and detailed summaries of PDF documents.
      Given the content of a PDF file, summarize it in 1000 words minimum and 1500 words maximum, keeping the key points.
      Do not add opinions or extra details.
      
      PDF Content:
      ${fileKey}
    `;

    const outputFormat = { summary: "<string>" };

    console.log("Generating summary...");
    const aiResponse = await strict_output(
      systemPrompt,
      fileKey, 
      outputFormat,
      "",
      false,
      "gpt-3.5-turbo",
      1
    );

    console.log("AI Summary Generated:", aiResponse.summary);

    await databaseClient.files.update({
      where: 
      { 
        id: parseInt(fileId, 10)
      },
      data: 
      { 
        summary: aiResponse.summary 
      }
    })

    return NextResponse.json(
      { success: true, summary: aiResponse.summary },
      { status: 200 }
    )
  } 
  catch (error) 
  {
    console.error("Error in POST /api/pdf-summary:", error);

    if (error instanceof ZodError) 
    {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
