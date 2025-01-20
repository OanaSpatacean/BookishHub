import { getS3Url } from "@/lib/s3";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";

export async function POST(req: Request) 
{
  try 
  {
    const session = await getAuthSession();

    if (!session?.user) 
    {
      return NextResponse.redirect("/");
    }

    const body = await req.json();
    const { keyOfFile, nameOfFile } = body;

    if (!keyOfFile || !nameOfFile) 
    {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await databaseClient.aboutPDFConversations.create({
      data: {
        fileKey: keyOfFile,
        pdfName: nameOfFile,
        pdfUrl: getS3Url(keyOfFile),
        userId: session.user.id,
    }})

    return NextResponse.json(
      { 
        chat_id: result.id 
      },
      { 
        status: 200 
      }
    )
  } 
  catch (error) 
  {
    console.error("Error handling POST request:", error);

    return NextResponse.json(
      { 
        error: "Internal server error" 
      },
      { 
        status: 500 
      }
    )
  }
}
