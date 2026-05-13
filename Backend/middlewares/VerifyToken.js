import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {

  return (req, res, next) => {

    try {

      // get token from cookies
      const token = req.cookies.token;

      console.log("TOKEN:", token);

      // token missing
      if (!token) {
        return res.status(401).json({
          message: "Token missing",
        });
      }

      // verify jwt
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET_KEY
      );

      console.log("DECODED:", decodedToken);

      // attach user
      req.user = decodedToken;

      // role check
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

      console.log("VERIFY ERROR:", err.message);

      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };
};