import { databaseClient } from '@/lib/database';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try 
  {
    const { aboutPDFConversationId } = await request.json();

    const pdfRequests = await databaseClient.pDFRequest.findMany({
      where: {
        aboutPDFConversationId,
      },
      include: {
        AboutPDFConversation: true,
    }})

    return NextResponse.json(pdfRequests);
  } 
  catch (error) 
  {
    console.error("Error fetching PDF requests:", error);

    return NextResponse.json(
    { 
        error: "An error occurred while fetching PDF requests." 
    },
    { 
        status: 500 
    })}
}