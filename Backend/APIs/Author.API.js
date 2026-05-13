import exp from "express";
import { register } from "../services/authService.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const authorRoute = exp.Router();


// ✅ Register Author
authorRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {

    let cloudinaryResult;

    try {

      // get user object
      let userObj = req.body;

      // upload image to cloudinary
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // register author
      const newUserObj = await register({
        ...userObj,
        role: "AUTHOR",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "Author created successfully",
        payload: newUserObj,
      });

    } catch (err) {

      // rollback cloudinary image if DB fails
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err);
    }
  }
);


// ✅ Create Article
authorRoute.post(
  "/articles",
  verifyToken("AUTHOR"),
  async (req, res) => {

    try {

      let article = req.body;

      // assign logged-in author automatically
      article.author = req.user.userId;

      // create document
      let newArticleDoc = new ArticleModel(article);

      // save article
      let createdArticleDoc = await newArticleDoc.save();

      res.status(201).json({
        message: "Article created successfully",
        payload: createdArticleDoc,
      });

    } catch (err) {

      console.error("Create article error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


// ✅ Read Articles Of Logged-in Author
authorRoute.get(
  "/articles",
  verifyToken("AUTHOR"),
  async (req, res) => {

    try {

      // logged in author id
      let aid = req.user.userId;

      // fetch active articles
      let articles = await ArticleModel.find({
        author: aid,
        isArticleActive: true,
      }).populate("author", "firstName email profileImageUrl");

      res.status(200).json({
        message: "Articles fetched successfully",
        payload: articles,
      });

    } catch (err) {

      console.error("Fetch articles error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);
// ✅ Get Articles By Author ID
authorRoute.get(
  "/articles/author/:authorId",
  verifyToken("AUTHOR"),
  async (req, res) => {

    try {

      const { authorId } = req.params;

      // fetch articles
      const articles = await ArticleModel.find({
        author: authorId,
      })
        .populate(
          "author",
          "firstName lastName email profileImageUrl"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Author articles fetched successfully",
        payload: articles,
      });

    } catch (err) {

      console.error("Fetch author articles error:", err);

      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);

// ✅ Edit Article
authorRoute.put(
  "/articles",
  verifyToken("AUTHOR"),
  async (req, res) => {

    try {

      let author = req.user.userId;

      // get modified data
      let {
        articleId,
        title,
        category,
        content
      } = req.body;

      // find article
      let articleOfDB = await ArticleModel.findOne({
        _id: articleId,
        author: author,
      });

      if (!articleOfDB) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // update article
      let updatedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        {
          $set: {
            title,
            category,
            content,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        message: "Article updated successfully",
        payload: updatedArticle,
      });

    } catch (err) {

      console.error("Update article error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


// ✅ Soft Delete / Restore Article
authorRoute.patch(
  "/articles/:id/status",
  verifyToken("AUTHOR"),
  async (req, res) => {

    try {

      const { id } = req.params;
      const { isArticleActive } = req.body;

      // find article
      const article = await ArticleModel.findById(id);

      if (!article) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // allow only owner author
      if (
        article.author.toString() !== req.user.userId
      ) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // already same state
      if (article.isArticleActive === isArticleActive) {
        return res.status(400).json({
          message: `Article is already ${
            isArticleActive ? "active" : "deleted"
          }`,
        });
      }

      // update status
      article.isArticleActive = isArticleActive;

      await article.save();

      res.status(200).json({
        message: `Article ${
          isArticleActive ? "restored" : "deleted"
        } successfully`,
        payload: article,
      });

    } catch (err) {

      console.error("Delete/Restore article error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


// ✅ Add Comment
authorRoute.post(
  "/articles/:id/comments",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      const { id } = req.params;
      const { comment } = req.body;

      // validation
      if (!comment || !comment.trim()) {
        return res.status(400).json({
          message: "Comment text is required",
        });
      }

      // find article
      const article = await ArticleModel.findById(id);

      if (!article || !article.isArticleActive) {
        return res.status(404).json({
          message: "Article not found or inactive",
        });
      }

      // create comment
      const newComment = {
        user: req.user.userId,
        comment: comment.trim(),
      };

      // push comment
      article.comments.push(newComment);

      await article.save();

      res.status(201).json({
        message: "Comment added successfully",
        payload: newComment,
      });

    } catch (err) {

      console.error("Comment error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


// ✅ Get Comments
authorRoute.get(
  "/articles/:id/comments",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {

    try {

      const article = await ArticleModel.findById(req.params.id)
        .populate(
          "comments.user",
          "firstName lastName email profileImageUrl"
        );

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

      console.error("Get comments error:", err);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);