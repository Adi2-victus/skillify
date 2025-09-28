import mongoose from "mongoose";

const lectureNoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  lectureId: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true },
}, { timestamps: true });

export const LectureNote = mongoose.model("LectureNote", lectureNoteSchema);