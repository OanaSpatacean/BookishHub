export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import { ZodError } from "zod";
import { textWritingSchemaUpdate } from "@/app/form-validators/text_writing";

export async function POST(req: Request) {
  try 
  {
    const session = await getAuthSession();
    
    if (!session?.user) 
    {
      return NextResponse.redirect("/");
    }

    const body = await req.json();
    const { textId, textState } = textWritingSchemaUpdate.parse(body);

    const text = await databaseClient.textWriting.findUnique({
      where: 
      { 
        id: textId 
      }
    })

    if (!text) 
    {
      return NextResponse.json({ error: "Text was not found" }, { status: 404 });
    }

    if (text.textState !== textState) 
    {
      await databaseClient.textWriting.update({
        where: 
        { 
            id: textId 
        },
        data: 
        { 
            textState: textState 
        }
      })
    }

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
