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

    if (!videoUrl.includes("https://www.youtube.com/embed/")) {
      return new NextResponse("Please provide a valid YouTube embed URL", { status: 400 });
    }

    // Update the chapter's videoUrl in the database
    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        videoUrl: videoUrl,
      }
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("[CHAPTER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
