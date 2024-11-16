import { databaseClient } from "@/lib/database";
import { ZodError, z } from "zod";
import { NextResponse } from "next/server";

const parseBody = z.object({topicId: z.string()});

export async function POST(request: Request, response: Response) 
{
    try 
    {
        const body = await request.json();
        const { topicId } = parseBody.parse(body);
        const topic = await databaseClient.topic.findUnique({where: {id: topicId}});

        if (!topic) 
        {
            return NextResponse.json({success: false, error: "Topic does not exist!"}, {status: 404});
        }
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