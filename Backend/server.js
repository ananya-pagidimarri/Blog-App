import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/UserAPI.js";
import cookieParser from "cookie-parser";
import { authorRoute } from "./APIs/Author.API.js";
import { commonRoute } from "./APIs/CommonAPI.js";
import { adminRoute } from "./APIs/AdminAPI.js";
import cors from "cors";

config();

// create app
const app = exp();


// ✅ CORS (VERY IMPORTANT - FINAL FIX)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blog-app-ahtk.vercel.app"
  ],
  credentials: true
}));


// ✅ middlewares
app.use(exp.json());
app.use(cookieParser());


// ✅ routes
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRoute);


// ✅ DB + SERVER START
const startServer = async () => {
  try {

    // check env
    if (!process.env.DB_URL) {
      console.log("❌ DB_URL missing in Render");
      process.exit(1);
    }

    await connect(process.env.DB_URL);
    console.log("✅ DB connection success");

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


// ✅ logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,      // required for HTTPS
    sameSite: "none"   // required for cross-origin
  });

  res.status(200).json({ message: "Logged out successfully" });
});


// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Invalid path: ${req.url}` });
});


// ✅ global error handler
app.use((err, req, res, next) => {

  console.log("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message
    });
  }

  res.status(500).json({
    message: "error occurred",
    error: "Server side error"
  });
});