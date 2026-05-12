import exp from "express";
import { register } from "../services/authService.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

export const userRoute = exp.Router();


// ================= REGISTER USER =================
userRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {

    let cloudinaryResult;

    try {

      // user data
      const userObj = req.body;

      // upload image if exists
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // register user
      const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url || "",
      });

      res.status(201).json({
        message: "User created successfully",
        payload: newUserObj,
      });

    } catch (err) {

      // rollback uploaded image if DB fails
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(
          cloudinaryResult.public_id
        );
      }

      next(err);
    }
  }
);


// ================= GET ALL ARTICLES =================
userRoute.get(
  "/articles",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      const articles = await ArticleModel.find({
        isArticleActive: true,
      })
        .populate(
          "author",
          "firstName lastName email profileImageUrl"
        )
        .populate(
          "comments.user",
          "email firstName"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Articles fetched successfully",
        payload: articles,
      });

    } catch (err) {

      console.log("Get articles error:", err);

      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);


// ================= ADD COMMENT =================
userRoute.put(
  "/articles",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      const { articleId, comment } = req.body;

      // validation
      if (!articleId || !comment?.trim()) {
        return res.status(400).json({
          message: "Article ID and comment are required",
        });
      }

      // update article
      const articleWithComment =
        await ArticleModel.findOneAndUpdate(
          {
            _id: articleId,
            isArticleActive: true,
          },
          {
            $push: {
              comments: {
                user: req.user.userId,
                comment: comment.trim(),
              },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        )
          .populate("author", "firstName email")
          .populate(
            "comments.user",
            "email firstName"
          );

      // article not found
      if (!articleWithComment) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      res.status(200).json({
        message: "Comment added successfully",
        payload: articleWithComment,
      });

    } catch (err) {

      console.log("Comment error:", err);

      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);


// ================= GET COMMENTS =================
userRoute.get(
  "/articles/:id/comments",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      const article = await ArticleModel.findById(
        req.params.id
      )
        .populate(
          "comments.user",
          "email firstName lastName profileImageUrl"
        )
        .select("comments");

      if (!article) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      res.status(200).json({
        message: "Comments fetched successfully",
        payload: article.comments,
      });

    } catch (err) {

      console.log("Get comments error:", err);

      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);