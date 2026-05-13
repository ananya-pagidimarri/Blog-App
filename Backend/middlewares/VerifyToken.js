import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {

  return async (req, res, next) => {

    try {

      const authHeader = req.headers.authorization;

      console.log("AUTH HEADER:", authHeader);

      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {
        return res.status(401).json({
          message: "Token missing",
        });
      }

      const token = authHeader.split(" ")[1];

      // IMPORTANT FIX
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      console.log("DECODED:", decodedToken);

      req.user = decodedToken;

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decodedToken.role)
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();

    } catch (err) {

      console.log("VERIFY TOKEN ERROR:", err);

      return res.status(401).json({
        message: "Invalid token",
        error: err.message,
      });
    }
  };
};