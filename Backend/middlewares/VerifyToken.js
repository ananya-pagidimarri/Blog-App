import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {

  return (req, res, next) => {

    try {

      // GET AUTH HEADER
      const authHeader = req.headers.authorization;

      console.log("AUTH HEADER:", authHeader);

      // CHECK TOKEN
      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {
        return res.status(401).json({
          message: "Token missing",
        });
      }

      // EXTRACT TOKEN
      const token = authHeader.split(" ")[1];

      // VERIFY TOKEN
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET_KEY
      );

      console.log("DECODED TOKEN:", decodedToken);

      // ATTACH USER
      req.user = decodedToken;

      // ROLE CHECK
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decodedToken.role)
      ) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      next();

    } catch (err) {

      console.log("VERIFY TOKEN ERROR:", err);

      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };
};