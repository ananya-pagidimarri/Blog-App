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

// CORS
app.use(cors({
  origin: ["http://localhost:5173",
    "https://blog-app-ahtk.vercel.app",
    "https://blog-app-2x6l.vercel.app"],
  credentials: true
}));

// body parser
app.use(exp.json());

// cookie parser
app.use(cookieParser());

// connect APIs
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRoute);

// connect to DB
const connectDB = async () => {
  try {

    await connect(process.env.DB_URL);
    console.log("DB connection success");

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });

  } catch (err) {
    console.log("Error in DB connection:", err);
  }
};

connectDB();

// logout route
app.post("/logout", (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });

  res.status(200).json({ message: "Logged out successfully" });

});

// invalid path handler
app.use((req, res) => {
  console.log(req.url);
  res.status(404).json({ message: `Invalid path: ${req.url}` });
});

// global error handler
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

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

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  // duplicate key error
  if (errCode === 11000) {

    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

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