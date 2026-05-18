 import jwt from "jsonwebtoken";

 const isProduction = process.env.NODE_ENV === "production";

 export const tokenCookieOptions = {
   httpOnly: true,
   secure: isProduction,
   sameSite: isProduction ? "none" : "lax",
   maxAge: 24 * 60 * 60 * 1000,
 };
 
 export const generateToken = (res, user, message) => {
   const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
     expiresIn: "1d",
   });
 
   return res
     .status(200)
     .cookie("token", token, tokenCookieOptions).json({
         success:true,
         message,
         user
     });
 };
 