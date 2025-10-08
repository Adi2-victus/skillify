
import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "https://skillifyapp.vercel.app";

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${FRONTEND_URL}/course-detail/${courseId}`,
      metadata: { courseId, userId },
    });

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({ paymentId: session.id }).populate("courseId");
      if (!purchase) return res.status(404).json({ message: "Purchase not found" });

      purchase.amount = session.amount_total / 100;
      purchase.status = "completed";

      if (purchase.courseId?.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      await User.findByIdAndUpdate(purchase.userId, { $addToSet: { enrolledCourses: purchase.courseId._id } });
      await Course.findByIdAndUpdate(purchase.courseId._id, { $addToSet: { enrolledStudents: purchase.userId } });

    } catch (error) {
      console.error("Error handling webhook event:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.status(200).send("Webhook received");
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId).populate("creator").populate("lectures");
    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) return res.status(404).json({ message: "Course not found!" });

    res.status(200).json({ course, purchased: !!purchased });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({ status: "completed" }).populate("courseId");
    res.status(200).json({ purchasedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
