import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { chapterId, videoUrl } = req.body;
    try {
      await db.chapter.update({
        where: { id: chapterId },
        data: { videoUrl },
      });
      res.status(200).json({ message: 'Video URL updated successfully' });
    } catch (error) {
      console.error('Error updating video URL:', error);
      res.status(500).json({ error: 'Failed to update video URL' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
