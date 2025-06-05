import { PDFRequestSchema } from "@/app/form-validators/PDFRequest";
import { databaseClient } from "@/lib/database";
import { strict_output } from "@/lib/openai";
import { UserSystemEnum } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod"; 

export async function POST(req: Request) {
  try 
  {
    const body = await req.json();
    const parsedBody = PDFRequestSchema.parse({
      ...body,
      messages: body.messages.map((msg: { role: string; }) => ({
        ...msg,
        role: msg.role === "assistant" ? "system" : msg.role, 
      }))
    })

    const { messages, fileId } = parsedBody;

    const file = await databaseClient.files.findUnique({
      where: { 
        id: fileId 
      }
    })

    if (!file || !file.fileKey) {
      return NextResponse.json(
        { 
          error: "File or fileKey not found" 
        },
        { 
          status: 404 
        }
      )
    }

    const fileKey = file.fileKey;
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) 
    {
      return NextResponse.json(
        { 
          error: "No messages found in the request" 
        },
        { 
          status: 400 
        }
      )
    }

    const systemPrompt = `The AI assistant is an advanced, human-like artificial intelligence designed to deliver exceptional performance. It embodies key attributes such as expert-level knowledge, resourcefulness, intelligence, and eloquence. The assistant is courteous and professional, consistently displaying friendliness, kindness, and a motivational demeanor. With access to an extensive repository of knowledge, the AI assistant can provide precise and insightful answers to a wide range of topics during files. The assistant operates using the following context:
      START CONTEXT BLOCK
      ${fileKey}
      END OF CONTEXT BLOCK
      I want you to provide responses that are strictly based on the given context. If a query's answer is found within the context of the PDF file, use that context directly to provide an accurate and relevant response.

      However, if the answer is not found in the PDF file, please inform the user that the information they seek is not available in the file and that you will provide the answer based on your own knowledge. Your response should be in the following format:
      
      1. Provide the answer as accurately as possible based on the PDF content (if available).
      2. Only if the information the user requested from you, is not based on the PDF content ${fileKey}, include this sentence: "Just to let you know, this specific information isn’t included in your file"
      3. Then, provide the answer based on your own knowledge.
      
      Do **not** apologize for any missing information, and focus on providing the correct answer from your own knowledge if the context is absent. Always make it clear when the information is derived from your own knowledge and when it comes from the file context.`;

    const userPrompt = lastMessage.content;
    const outputFormat = { content: "<string>" };

    console.log("Sending request to strict_output...");
    const aiResponse = await strict_output(
      systemPrompt,
      userPrompt,
      outputFormat,
      "",
      false,
      "gpt-3.5-turbo",
      1
    )

    console.log("AI Response:", aiResponse);

    await databaseClient.pDFRequest.create({
      data: {
        fileId,
        content: lastMessage.content,
        role: UserSystemEnum.USER
      }
    })

    await databaseClient.pDFRequest.create({
      data: {
        fileId,
        content: aiResponse.content,
        role: UserSystemEnum.SYSTEM
      }
    })

    return new Response(aiResponse.content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      }
    })
  } 
  catch (error) 
  {
    console.error("Error in POST /api/PDFRequestResponse:", error);

    if (error instanceof ZodError) 
    {
      return NextResponse.json(
        { 
          error: "Invalid request data", details: error.errors 
        },
        { 
          status: 400 
        }
      )
    }

    return NextResponse.json(
      { 
        error: "Internal Server Error" 
      },
      { 
        status: 500 
      }
    )
  }
}
