"use client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";
import { useState, useEffect } from "react";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";

const Spinner = ({ size = 40, color = '#1E3A8A' }) => {
  return (
    <div
      className="spinner"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderTopColor: `${color}`,
      }}
    ></div>
  );
};

export async function getServerSideProps(context: any) {
  const { userId } = auth();
  if (!userId) {
    return {
      redirect: {  // Ensure redirect object is structured correctly
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId,
    },
  };
}

const ChapterIdPage = ({
  params,
  userId // Pass userId as props
}: {
  params: { courseId: string; chapterId: string }
  userId: string; // Add userId prop
}) => {
  const [chapterData, setChapterData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
      });

      setChapterData(data);
    };

    fetchData();
  }, [userId, params.chapterId, params.courseId]);

  if (!chapterData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={48} color="blue" />
      </div>
    );
  }

  const {
    chapter,
    course,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = chapterData;

  if (!chapter || !course) {
    redirect("/");
    return null;
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          {/* VideoPlayer component */}
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            {/* Chapter title and course progress button */}
          </div>
          <Separator />
          <div>
            {/* Chapter description preview */}
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment: any) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;
