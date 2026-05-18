import jwt from "jsonwebtoken";
import { tokenCookieOptions } from "../utils/generateToken.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("token", { ...tokenCookieOptions, maxAge: 0 });
    return res.status(401).json({
      message: "Session expired or invalid. Please log in again.",
      success: false,
    });
  }
};
export default isAuthenticated;
