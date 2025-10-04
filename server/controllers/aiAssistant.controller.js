// File: src/controllers/aiAssistant.controller.js
import { Course } from "../models/course.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const aiAssistant = async (req, res) => {
  try {
    const { courseId, lectureId, question } = req.body;
    const userId = req.id;

    // Fetch course details for context
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Prepare context for AI
    let context = `You are an AI teaching assistant for a Learning Management System. 
      The student is currently taking the course: "${course.courseTitle}".
      Course description: ${course.courseDescription}`;

    // Add lecture context if available
    if (lectureId) {
      const lecture = course.lectures.find(
        (lec) => lec._id.toString() === lectureId
      );
      if (lecture) {
        context += `
          \nCurrent lecture: "${lecture.lectureTitle}"
          Lecture description: ${lecture.lectureDescription}
        `;
      }
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
      systemInstruction: {
        role: "model",
        parts: [{ text: context }]
      }
    });

    // Generate response
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: question }]
      }]
    });

    // const response = await result.response;
    //  const answer = response.text();

    let answer = "";
    if (result?.response?.text) {
      answer = result.response.text();
    } else if (typeof result?.response === "string") {
      answer = result.response;
    } else {
      answer = "Sorry, I could not generate a response.";
    }

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return res.status(500).json({ 
      message: "AI assistant is currently unavailable. Please try again later.",
      error: error.message 
    });
  }
};