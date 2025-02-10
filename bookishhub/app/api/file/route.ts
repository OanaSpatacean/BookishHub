import { getS3Url } from "@/lib/s3";
import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";
import { getAuthSession } from "@/lib/authentication";
import verifyMembership from "@/lib/membership";

export async function POST(req: Request) 
{
  try 
  {
    const session = await getAuthSession();
    const havePowerAccount = await verifyMembership();

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

    if (session.user.points <= 0 && !havePowerAccount && session.user.isAdmin == false) 
    {
        return new NextResponse("You have no more points to use for a new file breakdown!", 
                                    { 
                                        status: 402 
                                    }
                                )
    }

    const result = await databaseClient.files.create({
      data: {
        fileKey: keyOfFile,
        pdfName: nameOfFile,
        pdfUrl: getS3Url(keyOfFile),
        userId: session.user.id,
        summary: ""
    }})

    await databaseClient.user.update(
      {
          where: 
          {
            id: session.user.id
          },
          data: 
          {
            points: 
            {
              decrement: 2
            }
          }
      })

    return NextResponse.json(
      { 
        fileId: result.id 
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
