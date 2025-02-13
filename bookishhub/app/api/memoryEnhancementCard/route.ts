import { NextResponse } from "next/server";
import { createImageForMemoryEnhacementCard, createPromptForMemoryEnhacementCardImage } from "@/lib/openai";
import { getAuthSession } from "@/lib/authentication";
import { databaseClient } from "@/lib/database";

export async function POST(req: Request) 
{
  try 
  {
    const session = await getAuthSession();

    if (!session?.user) 
    {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await req.json();

    const user = await databaseClient.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) 
    {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [imageDescription, imageUrl] = await Promise.all([
      createPromptForMemoryEnhacementCardImage(name),
      createImageForMemoryEnhacementCard(await createPromptForMemoryEnhacementCardImage(name))
    ])

    if (!imageDescription || !imageUrl) 
    {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    const newMemoryEnhancementCard = await databaseClient.memoryEnhancementCard.create({
      data: {
        name,
        userId: session.user.id,
        imageUrl
      }
    })

    return NextResponse.json({ note_id: newMemoryEnhancementCard.id });
  } 
  catch (error) 
  {
    console.error("Error creating memory enhancement card:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
