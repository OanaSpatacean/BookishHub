import { getVideoTranscript, getQueriesAndSolutionsFromTranscript, findOnYt } from "@/lib/yt";
import { databaseClient } from "@/lib/database";
import { strict_output } from "@/lib/openai";
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

        let maximum_length_of_transcript = 600;
        const videoId = await findOnYt(topic.ytSearchQuery);

        let transcript = await getVideoTranscript(videoId);
        transcript = transcript.split(" ").slice(0, maximum_length_of_transcript).join(" ");

        const { outline }: { outline: string } = await strict_output(
            "You are an AI used for outlining a youtube transcript", "Please provide an outline in 600 words or fewer, focusing strictly on the primary topic. Avoid discussing sponsors or any other unrelated aspects. Do not include an introduction.\n"+ transcript, 
            { outline: "outline of the transcript" }
          );

        const queries = await getQueriesAndSolutionsFromTranscript(transcript, topic.topicName);

        await databaseClient.query.createMany(
        {
            data: queries.map((query) => {
              let choices = [
                query.solution,
                query.choice1,
                query.choice2,
                query.choice3,
                query.choice4,
              ];

              choices = choices.sort(() =>
                            Math.random() - 0.5);
              
              return {
                query: query.query,
                solution: query.solution,
                choices: JSON.stringify(choices),
                topicId: topicId
              }
        })})

        await databaseClient.topic.update(
        {
            where: { 
                id: topicId 
            },

            data: {
              videoId: videoId,
              outline: outline
            }
        })
        return NextResponse.json({success:true});
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