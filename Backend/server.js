import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import { userRoute } from "./APIs/UserAPI.js";
import { authorRoute } from "./APIs/Author.API.js";
import { commonRoute } from "./APIs/CommonAPI.js";
import { adminRoute } from "./APIs/AdminAPI.js";

config();

// create app
const app = exp();

// VERY IMPORTANT FOR RENDER + COOKIES
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: "https://blog-app-ahtk.vercel.app",
    credentials: true,
  })
);

// middlewares
app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRoute);

// logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});

// DB + SERVER START
const startServer = async () => {
  try {
    // check env
    if (!process.env.DB_URL) {
      console.log("❌ DB_URL missing");
      process.exit(1);
    }

    await connect(process.env.DB_URL);

    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

startServer();

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `Invalid path: ${req.url}`,
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.log("❌ Error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      error: err.message,
    });
  }

  // invalid mongodb id
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID",
      error: err.message,
    });
  }

  // duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return res.status(409).json({
      message: "Duplicate field",
      error: `${field} "${value}" already exists`,
    });
  }

  // custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: "Error occurred",
      error: err.message,
    });
  }

  // default
  res.status(500).json({
    message: "Server error",
    error: "Internal server error",
  });
});