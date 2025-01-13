import { getUnsplashImage } from "@/lib/unsplash";
import { ZodError } from "zod";
import { designTopicsSchema } from "@/app/form-validators/lesson"
import { strict_output } from "@/lib/openai";
import { databaseClient } from "@/lib/database";
import { NextResponse } from "next/server";
import verifyMembership from "@/lib/membership";
import { getAuthSession } from "@/lib/authentication";

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

        const session = await getAuthSession();
        
        if (!session?.user) 
        {
            return new NextResponse("You are not logged in", 
                                        { 
                                            status: 401 
                                        }
                                    )
        }
        
        const body = await request.json();
        const {name, modules} = designTopicsSchema.parse(body);
        const havePowerAccount = verifyMembership();

        console.log("Name:", name);
        console.log("Modules:", modules);

        if (session.user.points <= 0 && !havePowerAccount && !session.user.isAdmin) 
        {
            return new NextResponse("You have no more points to use for a new design!", 
                                        { 
                                            status: 402 
                                        }
                                    )
        }

        let return_modules: returnModules = await strict_output(
            "You are an AI used for designing lesson content, crafting suitable topic names for each module, and finding relevant and appropriate YouTube videos for each topic. Understand that a lesson contains modules given by the user. Your job is to suggest topics for each of those modules.",
            new Array(modules.length).fill(`Your task is to create a lesson about ${name}. For each of the following modules: ${modules.join(', ')}, create for each of the modules that you get in the provided array at least 3, 4, 5 or 6 topics (or more, how many topics you consider it is relevant for the module). After that, for each topic, design a specific YouTube search query to locate a comprehensive educational video related to that topic. Each search query should yield a clear, instructive video on YouTube.`),
            {
              name: "name of the module",
              topics: "an array of topics, where each topic should have a topicName key and a ytSearchQuery key in the JSON object",
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
                    lessonId: lesson.id,
                },
            });
        
            await databaseClient.topic.createMany({
                data: module.topics.map((topic) => {
                    return {
                        topicName: topic.topicName, 
                        ytSearchQuery: topic.ytSearchQuery, 
                        moduleId: databaseClientModule.id,
                    };
                }),
            });
        }

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
        
        return NextResponse.json({lessonId: lesson.id});
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
