import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";
import LectureNotes from "../../../components/LectureNotes"; // ADDED
import { useSelector } from "react-redux"; 

const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;
  const lectureId = params.lectureId;
  const { user } = useSelector((state) => state.auth); 
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button size="icon" variant="outline" className="rounded-full">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">Update Your Lecture</h1>
        </div>
      </div>
      <LectureTab />

      {/* Render LectureNotes component with canUpload prop */}
      {user?.role === 'instructor' && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Lecture Notes</h2>
            <p className="text-gray-600 mt-1">
              Upload study materials for this lecture
            </p>
          </div>
          
          <LectureNotes 
            courseId={courseId} 
            lectureId={lectureId} 
            canUpload={true}
          />
        </div>
      )}

    </div>
  );
};

export default EditLecture;
