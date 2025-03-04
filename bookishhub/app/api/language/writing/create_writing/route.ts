import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authentication";
import { createWritingSchema } from "@/app/form-validators/text_writing";
import { ZodError } from "zod";
import { databaseClient } from "@/lib/database";

export async function POST(request: Request) {
  try 
  {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.redirect("/");
    }

    const body = await request.json();
    const parsedData = createWritingSchema.parse(body);

    const languageId = String(parsedData.languageId);
    const languageSessionId = String(parsedData.languageSessionId);
    const level = parsedData.level;

    if (!["Beginner", "Intermediate", "Advanced"].includes(level)) 
    {
      return new NextResponse("Invalid level selection", { status: 400 });
    }

    const language = await databaseClient.language.findUnique({
      where: 
      { 
        id: parseInt(languageId) 
      },
      select: 
      { 
        name: true 
      }
    })

    if (!language) 
    {
      return new NextResponse("Language not found", { status: 404 });
    }

    const languageSession = await databaseClient.languageSession.findUnique({
      where: 
      { 
        id: parseInt(languageSessionId) 
      }
    })

    if (!languageSession) 
    {
      return new NextResponse("No existing session found", { status: 404 });
    }

    const existingTextWriting = await databaseClient.textWriting.findFirst({
      where: 
      { 
        sessionId: languageSession.id 
      }
    })

    if (existingTextWriting) 
    {
      return NextResponse.json({textWriting: existingTextWriting, message: "TextWriting already exists for this session"})
    }

    const newTextWriting = await databaseClient.textWriting.create({
      data: {
        name: "New writing text",
        textState: "",
        sessionId: languageSession.id
      }
    })

    return NextResponse.json({ textWriting: newTextWriting }, { status: 201 });
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
