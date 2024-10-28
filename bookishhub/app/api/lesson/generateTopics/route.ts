import { ZodError } from "zod";
import { generateTopicsSchema } from '@/../../../form-validators/lesson';
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response)
{
    try 
    {
        type outputModules = {
            name: string;
            topics: {
                ytSearchQuery: string;
                topicName: string;
            }
        }
        
        const body = await request.json();
        const {modules, name} = generateTopicsSchema.parse(body);
    } 
    catch (error) 
    {
        if(error instanceof ZodError)
        {
            return new NextResponse("Incorrect body format", {status:400})
        }
    }
}
