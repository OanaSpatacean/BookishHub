import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { ZodError } from "zod";
import { textWritingSchemaCreate } from "@/app/form-validators/text_writing";

export async function POST(req: Request) {
  try 
  {
    const body = await req.json();
    
    if (!body.textState || body.textState.trim() === "") {
        body.textState = "default text"; 
    }

    const { name, textState } = textWritingSchemaCreate.parse(body);

    const newTextWriting = await databaseClient.textWriting.create({
      data: {
        name,
        textState
      }
    })

    return NextResponse.json({ success: true }, { status: 200 })
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
