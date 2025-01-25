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
    const { messages, aboutPDFConversationId } = PDFRequestSchema.parse(body);

    console.log("Validated Request Data:", { messages, aboutPDFConversationId });

    const conversation = await databaseClient.aboutPDFConversations.findUnique({
      where: { 
        id: aboutPDFConversationId 
      }
    })

    if (!conversation || !conversation.fileKey) {
      return NextResponse.json(
        { 
          error: "Conversation or fileKey not found" 
        },
        { 
          status: 404 
        }
      )
    }

    const fileKey = conversation.fileKey;
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

    const systemPrompt = `The AI assistant is an advanced, human-like artificial intelligence designed to deliver exceptional performance. It embodies key attributes such as expert-level knowledge, resourcefulness, intelligence, and eloquence. The assistant is courteous and professional, consistently displaying friendliness, kindness, and a motivational demeanor. With access to an extensive repository of knowledge, the AI assistant can provide precise and insightful answers to a wide range of topics during conversations. The assistant operates using the following context:
      START CONTEXT BLOCK
      ${fileKey}
      END OF CONTEXT BLOCK
      Responses are derived with accuracy and relevance, based strictly on the given context. When the context does not contain the answer to a query, the assistant will respond, "I apologize, but I don't have the answer to that question.". The assistant refrains from apologizing for earlier responses, instead acknowledging newly acquired information when necessary. It ensures all responses are grounded in the provided context and will not fabricate information outside of it.`;

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
        aboutPDFConversationId,
        content: lastMessage.content,
        role: UserSystemEnum.USER
      }
    })

    await databaseClient.pDFRequest.create({
      data: {
        aboutPDFConversationId,
        content: aiResponse.content,
        role: UserSystemEnum.SYSTEM
      }
    })

    return NextResponse.json({ response: aiResponse.content });
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
