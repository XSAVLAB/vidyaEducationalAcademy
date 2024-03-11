import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { Banner } from "@/components/banner";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterActions } from "./_components/chapter-actions";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
  });

  if (!chapter) {
    return redirect("/")
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {/* Banner for unpublished chapters */}
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
      {/* Main content */}
      <div className="px-8 py-4">
        {/* Back button and title */}
        <div className="flex items-center justify-between">
          <div className="w-full">
            <span className="flex w-[9.5rem] px-2 items-center text-sm transition mb-6 rounded-lg outline outline-emerald-600 hover:bg-emerald-400 font-semibold outline-2">
              <Link
                href={`/teacher/courses/${params.courseId}`}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Link>
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-between w-full">
              <div className="flex flex-col gap-y-2 mb-8 sm:mb-0">
                <h1 className="text-2xl font-medium">
                  Chapter Creation
                </h1>
                <span className="text-sm text-green-400">
                  Fill all fields to publish
                </span>
              </div>
              <div>
                <ChapterActions
                  disabled={false}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                  isPublished={chapter.isPublished}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Chapter forms */}
        <div className="grid grid-cols-1 mb-40 gap-6 mt-16">
          {/* Title and description forms */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-xl">
                  Customize your chapter
                </h2>
              </div>
              <ChapterTitleForm
                initialData={{ title: chapter.title }}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            {/* Access settings form */}
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              {/* Video form */}
              <div className="flex items-center gap-x-2">
                <h2 className="text-xl">
                  Add a video
                </h2>
              </div>
              <ChapterVideoForm
                initialData={chapter}
                chapterId={params.chapterId}
                courseId={params.courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
