import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

export const userRoute = exp.Router();
//Register user
userRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    //getb user obj
    let userObj = req.body;

    //  Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Step 2: call existing register()
    const newUserObj = await register({
      ...userObj,
      role: "USER",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    // Step 3: rollback
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err); // send to your error middleware
  }
});

//Read all articles(protected route)
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  //read articles of all authors which are active
  const articles = await ArticleModel.find({ isArticleActive: true }).populate("comments.user", "email firstName");
  res.json({ message: "List of all articles", payload: articles });
});
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {
  try {
    //get comment obj from req (removed 'user' since verifyToken handles auth)
    const { articleId, comment } = req.body;

    // Validate required fields
    if (!articleId || !comment || !comment.trim()) {
      return res.status(400).json({ message: "Article ID and comment text are required" });
    }

    // Find article by id and update (no user check needed - verifyToken ensures authenticated USER)
    let articleWithComment = await ArticleModel.findOneAndUpdate(
      { _id: articleId, isArticleActive: true },
      { $push: { comments: { user: req.user.userId, comment: comment.trim() } } },
      { new: true, runValidators: true },
    ).populate("comments.user", "email firstName");


    //if article not found
    if (!articleWithComment) {
      return res.status(404).json({ message: "Article not found or inactive" });
    }

    //send res
    res.status(200).json({ message: "Comment added successfully", payload: articleWithComment });
  } catch (err) {
    console.error("Comment add error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Optional: Get comments for an article
userRoute.get("/articles/:id/comments", verifyToken("USER"), async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id)
      .populate("comments.user", "email firstName")
      .select("comments");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Comments retrieved", payload: article.comments });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});