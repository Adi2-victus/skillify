import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
// import mongoose from "mongoose";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Ensure we always provide an absolute https URL to Stripe
const FRONTEND_URL = process.env.FRONTEND_URL || "https://skillifyapp.vercel.app";
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
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
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `${FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
  }
};

export const stripeWebhook = async (req, res) => {
  // let event;

  // try {
  //   const payloadString = JSON.stringify(req.body, null, 2);
  //   const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

  //   const header = stripe.webhooks.generateTestHeaderString({
  //     payload: payloadString,
  //     secret,
  //   });

  //   event = stripe.webhooks.constructEvent(payloadString, header, secret);
  // } catch (error) {
  //   console.error("Webhook error:", error.message);
  //   return res.status(400).send(`Webhook error: ${error.message}`);
  // }


  let event;
  const sig = req.headers['stripe-signature'];

  try {
    // Verify signature with raw buffer
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET
    );
  } catch (error) {
    // Fallback for environments where signature verification can fail
    // (e.g., cold starts or misconfigured secrets). We still attempt to
    // parse the event so purchases don't remain pending in test mode.
    try {
      const raw = Buffer.isBuffer(req.body) ? req.body.toString() : req.body;
      event = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (parseErr) {
      console.error("Webhook parse error:", parseErr.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed" ) {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).json({ received: true });
};

// export const stripeWebhook = async (req, res) => {
//   let event;
//   const sig = req.headers['stripe-signature'];

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.WEBHOOK_ENDPOINT_SECRET
//     );
//   } catch (error) {
//     try {
//       const raw = Buffer.isBuffer(req.body) ? req.body.toString() : req.body;
//       event = typeof raw === 'string' ? JSON.parse(raw) : raw;
//     } catch (parseErr) {
//       console.error("Webhook parse error:", parseErr.message);
//       return res.status(400).send(`Webhook error: ${error.message}`);
//     }
//   }

//   console.log(`Received event type: ${event.type}`);

//   try {
//     // Handle multiple event types that indicate successful payment
//     if (event.type === "checkout.session.completed" || 
//         event.type === "payment_intent.succeeded" ||
//         event.type === "charge.succeeded" ||
//         event.type === "charge.updated") {
      
//       let session;
      
//       if (event.type === "checkout.session.completed") {
//         session = event.data.object;
//       } else if (event.type === "payment_intent.succeeded") {
//         const paymentIntent = event.data.object;
//         const sessions = await stripe.checkout.sessions.list({
//           payment_intent: paymentIntent.id,
//           limit: 1
//         });
//         session = sessions.data[0];
//       } else if (event.type === "charge.succeeded" || event.type === "charge.updated") {
//         const charge = event.data.object;
//         // Only process if charge is successful
//         if (charge.status === 'succeeded') {
//           const sessions = await stripe.checkout.sessions.list({
//             payment_intent: charge.payment_intent,
//             limit: 1
//           });
//           session = sessions.data[0];
//         }
//       }

//       if (!session) {
//         console.log("No session found for event:", event.type);
//         return res.status(200).json({ received: true });
//       }

//       console.log("Processing purchase for session:", session.id);

//       const purchase = await CoursePurchase.findOne({
//         paymentId: session.id,
//       }).populate({ path: "courseId" });

//       if (!purchase) {
//         console.log("Purchase not found for paymentId:", session.id);
//         return res.status(200).json({ received: true });
//       }

//       // Only process if not already completed
//       if (purchase.status !== "completed") {
//         if (session.amount_total) {
//           purchase.amount = session.amount_total / 100;
//         }
//         purchase.status = "completed";

//         // Make all lectures visible by setting `isPreviewFree` to true
//         if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//           await Lecture.updateMany(
//             { _id: { $in: purchase.courseId.lectures } },
//             { $set: { isPreviewFree: true } }
//           );
//         }

//         await purchase.save();

//         // Update user's enrolledCourses
//         await User.findByIdAndUpdate(
//           purchase.userId,
//           { $addToSet: { enrolledCourses: purchase.courseId._id } },
//           { new: true }
//         );

//         // Update course to add user ID to enrolledStudents
//         await Course.findByIdAndUpdate(
//           purchase.courseId._id,
//           { $addToSet: { enrolledStudents: purchase.userId } },
//           { new: true }
//         );

//         console.log("Purchase completed successfully for user:", purchase.userId);
//       }
//     }
//   } catch (error) {
//     console.error("Error handling event:", error);
//     return res.status(200).json({ received: true });
//   }

//   res.status(200).json({ received: true });
// };







export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" 
         
      });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);
    
    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
