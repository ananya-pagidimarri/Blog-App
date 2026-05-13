import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {

  return (req, res, next) => {

    try {

      // get token from cookies
      const token = req.cookies.token;

      // token missing
      if (!token) {
        return res.status(401).json({
          message: "Token missing",
        });
      }

      // verify token
      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY
      );

      // attach user
      req.user = decoded;

      // role check
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      next();

    } catch (err) {

      console.log("Verify token error:", err.message);

      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };
};