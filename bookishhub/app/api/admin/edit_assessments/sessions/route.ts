import { databaseClient } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try 
    {
        const { id } = await req.json();

        if (!id) 
        {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        const sessionId = parseInt(id, 10);

        if (isNaN(sessionId)) 
        {
            return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
        }

        const sessionExists = await databaseClient.languageSession.findUnique({
            where: 
            { 
                id: sessionId 
            }
        })

        if (!sessionExists) 
        {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        const deleteIfExists = async (model: any, where: any) => {
            const count = await model.count({ where });

            if (count > 0) 
            {
                await model.deleteMany({ where });
            }
        }

        await deleteIfExists(databaseClient.grammarQuestion, { sessionId });
        await deleteIfExists(databaseClient.rephrasingQuestion, { sessionId });
        await deleteIfExists(databaseClient.textWriting, { sessionId });
        await deleteIfExists(databaseClient.pronunciationWord, { sessionId });
        await deleteIfExists(databaseClient.listeningExercise, { sessionId });
        await deleteIfExists(databaseClient.readingQuestion, { sessionId });
        await deleteIfExists(databaseClient.readingText, { sessionId });

        await databaseClient.languageSession.delete({
            where: 
            { 
                id: sessionId 
            }
        })

        return NextResponse.json({ message: "Session deleted successfully" }, { status: 200 });
    } 
    catch (error) 
    {
        console.error("Error deleting session:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
