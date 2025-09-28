import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
  uploadLectureNote,
  getLectureNotes,
  deleteLectureNote 
} from "../controllers/lectureNote.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

const handleMulterErrors = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ 
      error: err.message || "File upload error" 
    });
  }
  next();
};
router.post(
  "/upload",
  isAuthenticated,
  upload.single("note"),
   handleMulterErrors, 
  uploadLectureNote
);

// router.get("/:lectureId", isAuthenticated, getLectureNotes);
// Change the GET route from /:lectureId to /
router.get("/", isAuthenticated, getLectureNotes);
router.delete("/:noteId", isAuthenticated, deleteLectureNote);

export default router;