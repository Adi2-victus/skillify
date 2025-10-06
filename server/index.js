// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import connectDB from "./database/db.js";
// import userRoute from "./routes/user.route.js";

// import courseRoute from "./routes/course.route.js";
// import mediaRoute from "./routes/media.route.js";
// // import purchaseRoute from "./routes/purchaseCourse.route.js";
// import courseProgressRoute from "./routes/courseProgress.route.js";
// import { stripeWebhook } from "./controllers/coursePurchase.controller.js";
// import purchaseRoute from "./routes/purchaseCourse.route.js";
// import lectureNoteRoute from "./routes/lectureNote.route.js";
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // import bodyParser from "body-parser";

// dotenv.config({});

// // call database connection here
// connectDB();
// const app = express();

// const PORT = process.env.PORT || 3000;

// // Register webhook routes FIRST - before any middleware that might interfere
// // app.post("/api/v1/purchase/webhook", express.raw({ type: "application/json" }), stripeWebhook);





// app.use(cookieParser());

// import csrf from "csurf";
// // app.use(csrf(Protection));
// const csrfProtection = csrf({ cookie: true });

// // ✅ Route to send CSRF token to client
// app.get("/api/csrf-token", csrfProtection, (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// // Webhook routes moved to top of file



// app.use("/api/v1/purchase", purchaseRoute);

// app.use(cors({
//     origin:"https://skillifyapp.vercel.app",
//     credentials:true
// }));


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));






// // apis
// app.use("/api/v1/media", mediaRoute);
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/course", courseRoute);
// app.use("/api/v1/notes", lectureNoteRoute);

// app.use("/api/v1/purchase", purchaseRoute);
// app.use("/api/v1/progress", courseProgressRoute);
 


// // File: src/index.js (update)
// // ... existing imports ...
// import aiAssistantRoute from "./routes/aiAssistant.route.js";

// // ... after other routes ...
// app.use("/api/v1/ai", aiAssistantRoute);

// // setInterval(scheduleSmartReminders, 24 * 60 * 60 * 1000); // Run daily
// app.listen(PORT, () => {
//     console.log(`Server listen at port ${PORT}`);
// })





// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import connectDB from "./database/db.js";
// import path from "path";
// import { fileURLToPath } from "url";

// import userRoute from "./routes/user.route.js";
// import courseRoute from "./routes/course.route.js";
// import mediaRoute from "./routes/media.route.js";
// import purchaseRoute from "./routes/purchaseCourse.route.js";
// import courseProgressRoute from "./routes/courseProgress.route.js";
// import lectureNoteRoute from "./routes/lectureNote.route.js";
// import aiAssistantRoute from "./routes/aiAssistant.route.js";
// import { stripeWebhook } from "./controllers/coursePurchase.controller.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 3000;

// //  Enable CORS for your frontend only
// app.use(cors({
//     origin: "https://skillifyapp.vercel.app",
//     credentials: true,
// }));

// app.use(cookieParser());

// //  Stripe webhook must come BEFORE express.json() and other middleware
// app.post(
//     "/api/v1/purchase/webhook",
//     express.raw({ type: "application/json" }),
//     stripeWebhook
// );

// //  Body parsers for other routes
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ------------------- ROUTES -------------------

// // Purchase routes (other than webhook)
// app.use("/api/v1/purchase", purchaseRoute);

// app.use("/api/v1/media", mediaRoute);
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/course", courseRoute);
// app.use("/api/v1/notes", lectureNoteRoute);
// app.use("/api/v1/progress", courseProgressRoute);
// app.use("/api/v1/ai", aiAssistantRoute);

// // Optional: CSRF route if you use CSRF protection
// // import csrf from "csurf";
// // const csrfProtection = csrf({ cookie: true });
// // app.get("/api/csrf-token", csrfProtection, (req, res) => res.json({ csrfToken: req.csrfToken() }));

// // ------------------- START SERVER -------------------
// app.listen(PORT, () => {
//     console.log(`Server listening at port ${PORT}`);
// });






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
    credentials: true,
}));

app.use(cookieParser());

// ------------------- Stripe Webhook -------------------
// ⚠ Must be BEFORE express.json()


// ------------------- Body parsers -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
