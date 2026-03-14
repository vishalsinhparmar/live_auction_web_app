import jwt from "jsonwebtoken";
import { sendErrorMessage } from "../utils/sendMessage.js";

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorMessage(res, "Authorization token is missing", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return sendErrorMessage(res, "Authorization token is missing", 401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return sendErrorMessage(res, "Invalid or expired token", 401);
      }

      req.user = data;
      next();
    });
  } catch (err) {
    console.log("error happen verifyUser middleware", err.message);
    return sendErrorMessage(res, "internal server error", 500);
  }
};
