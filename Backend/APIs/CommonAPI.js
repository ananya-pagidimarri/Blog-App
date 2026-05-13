import exp from "express";
import { authenticate } from "../services/authService.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

export const commonRoute = exp.Router();


// ================= LOGIN =================
commonRoute.post(
  "/login",
  async (req, res, next) => {

    try {

      const userCredObj = req.body;

      // authenticate user
      const {
        token,
        user,
      } = await authenticate(userCredObj);

      // send token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60, // 1 hour
      });

      console.log("Cookie sent successfully");

      // send response
      res.status(200).json({
        message: "Login successful",
        payload: user,
      });

    } catch (err) {

      next(err);
    }
  }
);


// ================= LOGOUT =================
commonRoute.get(
  "/logout",
  (req, res) => {

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  }
);


// ================= CHECK AUTH =================
commonRoute.get(
  "/check-auth",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      res.status(200).json({
        message: "Authenticated user",
        payload: {
          userId: req.user.userId,
          role: req.user.role,
          email: req.user.email,
        },
      });

    } catch (err) {

      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);