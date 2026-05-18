
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import path from "path";
import { fileURLToPath } from "url";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import lectureNoteRoute from "./routes/lectureNote.route.js";
import aiAssistantRoute from "./routes/aiAssistant.route.js";
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
    "/api/v1/purchase/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);
// ------------------- CORS -------------------
app.use(cors({
    origin: "https://skillifyapp.vercel.app",
    // origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));

app.use(cookieParser());

// ------------------- Stripe Webhook -------------------
// ⚠ Must be BEFORE express.json()


// ------------------- Body parsers -------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ------------------- Static uploads -------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------- Routes -------------------
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/notes", lectureNoteRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/ai", aiAssistantRoute);

// ------------------- Test Route -------------------
// app.get("/", (req, res) => res.send("Skillify backend is live"));

// ------------------- Start Server -------------------
const server = app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});

// Set server timeout to handle large file uploads
server.timeout = 300000; // 5 minutes
