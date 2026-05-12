import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {

  return async (req, res, next) => {

    try {

      // read token from cookies
      const token = req.cookies?.token;

      // token missing
      if (!token) {
        return res.status(401).json({
          message: "Token missing. Please login again.",
        });
      }

      // verify token
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      console.log("Decoded Token:", decodedToken);

      // role check
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decodedToken.role)
      ) {
        return res.status(403).json({
          message:
            "Forbidden. You don't have permission to access this resource.",
        });
      }

      // attach user data
      req.user = decodedToken;

      // move to next middleware
      next();

    } catch (err) {

      console.log("Verify token error:", err);

      // token expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please login again.",
        });
      }

      // invalid token
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token. Please login again.",
        });
      }

      // other errors
      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  };
};