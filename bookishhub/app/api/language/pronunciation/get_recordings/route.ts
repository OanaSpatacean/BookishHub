import { databaseClient } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) 
{
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) 
  {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try 
  {
    const pronunciationWords = await databaseClient.pronunciationWord.findMany({
      where: 
      {
        sessionId: parseInt(sessionId),
      },
      select: 
      {
        id: true,
        recordingUrl: true
      }
    })

    return NextResponse.json(pronunciationWords, { status: 200 });
  } 
  catch (error) 
  {
    console.error('Error fetching recordings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
