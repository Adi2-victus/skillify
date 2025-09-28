import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);