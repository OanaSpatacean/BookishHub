import { databaseClient } from '@/lib/database';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try 
  {
    const { fileId } = await request.json();

    const pdfRequests = await databaseClient.pDFRequest.findMany({
      where: {
        fileId,
      },
      include: {
        File: true,
    }})

    return NextResponse.json(pdfRequests);
  } 
  catch (error) 
  {
    console.error("Error fetching file requests:", error);

    return NextResponse.json(
    { 
        error: "An error occurred while fetching file requests." 
    },
    { 
        status: 500 
    })}
}