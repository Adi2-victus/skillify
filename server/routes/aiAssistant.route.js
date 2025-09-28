// File: src/routes/aiAssistant.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { aiAssistant } from "../controllers/aiAssistant.controller.js";

const router = express.Router();
router.route("/assist").post(isAuthenticated, aiAssistant);

export default router;