import { LectureNote } from "../models/lectureNote.model.js";
import fs from 'fs';
import path from 'path';

export const uploadLectureNote = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename, path: filePath, mimetype, size } = req.file;

    const note = new LectureNote({
      userId,
      courseId,
      lectureId,
      fileName: originalname,
    //   filePath: filename,
    // filePath: `notes/${req.file.filename}`,
    filePath: `notes/${filename}`,
      fileType: mimetype,
      fileSize: size
    });

    await note.save();

    res.status(201).json({
      message: "Note uploaded successfully",
       note: {
        ...note._doc,
        fileUrl: `http://localhost:3000/uploads/notes/${filename}`
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





// Update the getLectureNotes function
export const getLectureNotes = async (req, res) => {
  try {
    const { courseId, lectureId } = req.query;
    
    const notes = await LectureNote.find({ 
      courseId, 
      lectureId 
    }).sort({ createdAt: -1 });

    const notesWithUrls = notes.map(note => ({
      ...note._doc,
      fileUrl: `http://localhost:3000/uploads/notes/${note.filePath.split('/').pop()}`
    }));

    res.status(200).json(notesWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteLectureNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.id;

    const note = await LectureNote.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete the file from the server
    const filePath = path.join('uploads', note.filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting file" });
      }
    });
    // In deleteLectureNote controller
if (user.role !== 'instructor') {
  return res.status(403).json({ message: "Unauthorized" });
}

    await LectureNote.deleteOne({ _id: noteId });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};