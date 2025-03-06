import { databaseClient } from '@/lib/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') 
  {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') 
  {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    const pronunciationWords = await databaseClient.pronunciationWord.findMany({
      where: 
      {
        sessionId: parseInt(sessionId)
      },
      select: 
      {
        id: true,
        recordingUrl: true
      }
    })

    return res.status(200).json(pronunciationWords); 
  } 
  catch (error) 
  {
    console.error('Error fetching recordings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
