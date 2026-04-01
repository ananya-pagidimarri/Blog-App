import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
    //read token from req
    let token = req.cookies.token; //{ token :""}
    console.log("token :", token);
    if (token === undefined) {
      return res.status(400).json({ message: "Unauthorized req. PLz login" });
  }
  //verify the validity of the token( decoding the token)
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded Token :", decodedToken);
      console.log("Allowed Roles :", allowedRoles);
  //check if role of user is in allowedRoles
  if (!allowedRoles.includes(decodedToken.role)) {
    return res.status(403).json({ message: "Forbidden. You don't have permission to access this resource." });
  }

  //set userId in request object
  req.user = decodedToken;//{userId:'', role:''}

  //forward req to next middleware/route
  next();
    } catch (err) {
      //jwt.verify throws error if token is invalid or expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again." });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please login again." });
      }
      // next(err);
    }
  }; 
};
