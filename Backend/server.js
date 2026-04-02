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

// Create express application
const app = exp();


//  CORS (FIXED FOR PRODUCTION)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blog-app-ahtk.vercel.app"
  ],
  credentials: true
}));


//  body parser
app.use(exp.json());


//   cookie parser
app.use(cookieParser());


//  APIs
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRoute);


// DB CONNECTION + SERVER START
const startServer = async () => {
  try {

    // 🔥 CHECK ENV VARIABLE
    if (!process.env.DB_URL) {
      console.log("❌ DB_URL is missing in Render Environment Variables");
      process.exit(1);
    }

    await connect(process.env.DB_URL);
    console.log("✅ DB connection success");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log("❌ Error in DB connection:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

startServer();


//  LOGOUT ROUTE (FIXED FOR PRODUCTION)
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,      
    sameSite: "none"   
  });

  res.status(200).json({ message: "Logged out successfully" });
});


//  INVALID PATH HANDLER
app.use((req, res) => {
  res.status(404).json({ message: `Invalid path: ${req.url}` });
});


// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {

  console.log("Error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  const errCode = err.code ?? err.cause?.code;

  // duplicate key error
  if (errCode === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    });
  }

  // custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message
    });
  }

  // default error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error"
  });
});