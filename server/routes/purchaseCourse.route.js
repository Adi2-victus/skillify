// import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, stripeWebhook } from "../controllers/coursePurchase.controller.js";

// const router = express.Router();
// export const webhookRouter = express.Router();
// webhookRouter.route("/webhook").post(
//   express.raw({ type: "application/json" }), 
//   stripeWebhook
// );

// router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
// // router.route("/webhook").post(express.raw({type:"application/json"}), stripeWebhook);
// router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);

// router.route("/").get(isAuthenticated,getAllPurchasedCourse);

// export default router;



import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);




router.post("/checkout/create-checkout-session", isAuthenticated, createCheckoutSession);
router.get("/course/:courseId/detail-with-status", isAuthenticated, getCourseDetailWithPurchaseStatus);
router.get("/", isAuthenticated, getAllPurchasedCourse);

export default router;
