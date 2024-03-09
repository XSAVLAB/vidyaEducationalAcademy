import { useState } from "react";
import { toast } from "react-hot-toast";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl: string;
  };
  chapterId: string;
  courseId: string;
}

export const ChapterVideoForm = ({
  initialData,
  chapterId,
  courseId,
}: ChapterVideoFormProps) => {
  const initialVideoUrl = initialData?.videoUrl || "";
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/updateChapterVideoUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapterId, videoUrl }),
      });

      if (response.ok) {
        toast.success("Video URL updated successfully");
      } else {
        throw new Error("Failed to update video URL");
      }
    } catch (error) {
      console.error("Error updating video URL:", error);
      toast.error("Failed to update video URL");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center items-center py-10">
      <div className="w-1/2 text-xl font-bold">YouTube Video URL
        <TextInput
          label="Enter YouTube embed link => https://www.youtube.com/embed/"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          required
        />
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
