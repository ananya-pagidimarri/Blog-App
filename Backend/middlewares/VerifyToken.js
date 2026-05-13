import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...roles) => {

  return async (req, res, next) => {

    try {

      // get token from cookies
      const token = req.cookies.token;

      // token missing
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized - token missing",
        });
      }

      // verify token
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET_KEY
      );

      // attach user
      req.user = decodedToken;

      // role authorization
      if (
        roles.length > 0 &&
        !roles.includes(decodedToken.role)
      ) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      next();

    } catch (err) {

      console.log("Verify token error:", err.message);

      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};