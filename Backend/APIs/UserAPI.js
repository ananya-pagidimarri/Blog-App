import exp from "express";
import { register } from "../services/authService.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

export const userRoute = exp.Router();


// ✅ Register User
userRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {

    let cloudinaryResult;

    try {

      // get user data
      let userObj = req.body;

      // upload image to cloudinary
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // register user
      const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "User created successfully",
        payload: newUserObj,
      });

    } catch (err) {

      // rollback uploaded image if DB fails
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err);
    }
  }
);


// ✅ Read All Articles
userRoute.get(
  "/articles",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      // get all active articles
      const articles = await ArticleModel.find({
        isArticleActive: true,
      })
        .populate("author", "firstName lastName email profileImageUrl")
        .populate("comments.user", "email firstName");

      res.status(200).json({
        message: "List of all articles",
        payload: articles,
      });

    } catch (err) {

      console.error("Get articles error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


// ✅ Add Comment To Article
userRoute.put(
  "/articles",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      const { articleId, comment } = req.body;

      // validation
      if (!articleId || !comment || !comment.trim()) {
        return res.status(400).json({
          message: "Article ID and comment text are required",
        });
      }

      // update article with comment
      let articleWithComment = await ArticleModel.findOneAndUpdate(
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
        .populate("comments.user", "email firstName");

      // article not found
      if (!articleWithComment) {
        return res.status(404).json({
          message: "Article not found or inactive",
        });
      }

      // success response
      res.status(200).json({
        message: "Comment added successfully",
        payload: articleWithComment,
      });

    } catch (err) {

      console.error("Comment add error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


// ✅ Get Comments Of Article
userRoute.get(
  "/articles/:id/comments",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      const article = await ArticleModel.findById(req.params.id)
        .populate(
          "comments.user",
          "email firstName lastName profileImageUrl"
        )
        .select("comments");

      // article not found
      if (!article) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // success response
      res.status(200).json({
        message: "Comments retrieved",
        payload: article.comments,
      });

    } catch (err) {

      console.error("Get comments error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);