import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if (!course || !course.chapters || course.chapters.length === 0) {
    return redirect(`/courses/5d41f577-1cce-46c3-964c-cca9ead21e43/chapters/89f053a1-6349-403f-8d3c-3161df090800`);
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[1].id}`);
}

export default CourseIdPage;