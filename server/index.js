import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";

import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
// import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
// import { stripeWebhook } from "./controllers/coursePurchase.controller.js";
import purchaseRoute, { webhookRouter } from "./routes/purchaseCourse.route.js";
import lectureNoteRoute from "./routes/lectureNote.route.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({});

// call database connection here
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

// At the top ofe



app.use(cookieParser());

import csrf from "csurf";
// app.use(csrf(Protection));
const csrfProtection = csrf({ cookie: true });

// ✅ Route to send CSRF token to client
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/v1/purchase", webhookRouter);
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));






// apis
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/notes", lectureNoteRoute);

app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
 


// File: src/index.js (update)
// ... existing imports ...
import aiAssistantRoute from "./routes/aiAssistant.route.js";

// ... after other routes ...
app.use("/api/v1/ai", aiAssistantRoute);

// setInterval(scheduleSmartReminders, 24 * 60 * 60 * 1000); // Run daily
app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
})


