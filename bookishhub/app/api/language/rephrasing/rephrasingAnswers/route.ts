import { NextResponse } from "next/server";
import { databaseClient } from "@/lib/database";

export async function POST(request: Request) {
    try 
    {
        const { questionId, userAnswer } = await request.json();

        if (!questionId || !userAnswer) 
        {
            return new NextResponse("Invalid request", { status: 400 });
        }

        await databaseClient.rephrasingQuestion.update({
            where: 
            { 
                id: questionId 
            },
            data: 
            { 
                userAnswer 
            }
        })

        return new NextResponse("Answer updated", { status: 200 })
    } 
    catch (error) 
    {
        console.error("Error updating answer:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
