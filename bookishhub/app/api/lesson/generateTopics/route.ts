import { getUnsplashImage } from "@/lib/unsplash";
import { ZodError } from "zod";
import { generateTopicsSchema } from "@/app/form-validators/lesson"
import { strict_output } from "@/lib/openai";
import { databaseClient } from "@/lib/database";
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
        }[];
        
        const body = await request.json();
        const {modules, name} = generateTopicsSchema.parse(body);

        console.log("Modules:", modules);
        console.log("Name:", name);

        let return_modules: returnModules = await strict_output(
            "You are an AI used for designing lesson content, crafting suitable topic names for each module, and finding relevant and appropriate YouTube videos for each topic",
            new Array(modules.length).fill(`Your task is to create a lesson about ${name}. For each of the following modules: ${modules.join(', ')}, create for each of the modules that you get in the provided array at least 3 topics (or more, how many topics you consider it is relevant for the module). After that, for each topic, generate a specific YouTube search query to locate a comprehensive educational video related to that topic. Each search query should yield a clear, instructive video on YouTube.`),
            {
              name: "name of the module",
              topics: "an array of topics, where each topic should have a youtubeSearchQuery and a topicName key in the JSON object",
            }
        );

        const imageQuery = await strict_output(
            "You are an AI designed to find the most suitable images for educational content.",
            `Please suggest an effective image search query for the name of a lesson on ${name}. This query will be used with the Unsplash API, so ensure it is a suitable search term that will yield relevant results.`,
            {
                image_query: "a suitable search query for the lesson name",
            }
        );

        const lesson_image = await getUnsplashImage( imageQuery.image_query );

        const lesson = await databaseClient.lesson.create(
        {
            data: {
                lessonName: name,
                picture: lesson_image as string,
            },
        });

        for (const module of return_modules) {
            const name = module.name;
        
            const databaseClientModule = await databaseClient.module.create({
                data: {
                    moduleName: name,
                    lessonId: lesson.uid,
                },
            });
        
            await databaseClient.topic.createMany({
                data: module.topics.map((topic) => {
                    return {
                        topicName: topic.topicName, 
                        ytSearchQuery: topic.ytSearchQuery, 
                        moduleId: databaseClientModule.uid,
                    };
                }),
            });
        }
        

        console.log(return_modules);
        return NextResponse.json({return_modules, imageQuery, lesson_image});
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
