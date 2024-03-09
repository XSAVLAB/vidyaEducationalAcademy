import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
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

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      }
    });

    if (!chapter || !chapter.title || !chapter.description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const { videoUrl } = await req.json();
    const videoId = extractYouTubeVideoId(videoUrl);

    if (!videoId) {
      // If the URL is not a valid YouTube URL, throw an error
      return new NextResponse("Please provide a valid YouTube URL", { status: 400 });
    }

    // Store the complete YouTube URL in the database
    const patchedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        videoUrl: videoUrl,
        videoEmbedUrl: `https://www.youtube.com/embed/${videoId}`,
      }
    });

    return NextResponse.json(patchedChapter);
  } catch (error) {
    console.log("[CHAPTER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Function to extract video ID from a YouTube URL
function extractYouTubeVideoId(url: string): string | null {
  const videoIdRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(videoIdRegex);
  return match ? match[1] : null;
}
