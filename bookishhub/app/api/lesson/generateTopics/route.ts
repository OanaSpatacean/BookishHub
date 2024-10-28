import { ZodError } from "zod";
import { generateTopicsSchema } from "@/app/form-validators/lesson"
import { strict_output } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response)
{
    try 
    {
        type returnModules = {
            name: string;
            topics: {
                ytSearchQuery: string;
                topicName: string;
            }[];
        }
        
        const body = await request.json();
        const {modules, name} = generateTopicsSchema.parse(body);

        let return_modules: returnModules = await strict_output(
            "You are an AI used for designing lesson content, crafting suitable topic names, and finding relevant and appropriate YouTube videos for each topic",
            new Array(modules.length).fill(`Your task is to create a lesson about ${name}. The user has requested the creation of topics for each of the modules. After that, for each topic, generate a specific YouTube search query to locate a comprehensive educational video related to that topic. Each search query should yield a clear, instructive video on YouTube.`),
            {
              name: "module name",
              topics: "an array of topics, where each topic should have a youtubeSearchQuery and a topicName key in the JSON object",
            }
          );
    } 
    catch (error) 
    {
        if(error instanceof ZodError)
        {
            return new NextResponse("Incorrect body format", {status:400})
        }
    }
}
