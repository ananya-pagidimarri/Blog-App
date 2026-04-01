import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch article (only when needed)
  useEffect(() => {
    if (location.state) return;

    const getArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:4000/user-api/article/${id}`,
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      } catch (err) {
        console.error(err); // ✅ fixes no-unused-vars
        setError(err.response?.data?.error || "Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, location.state]); // ✅ no eslint warning

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ✅ Delete / Restore
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus
      ? "Restore this article?"
      : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      );

      setArticle(res.data.payload);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;
      if (err.response?.status === 400) {
        toast(msg);
      } else {
        setError(msg || "Operation failed");
      }
    }
  };

  // ✅ Edit
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  // ✅ Add Comment
  const addComment = async (commentObj) => {
    commentObj.articleId = article._id;

    try {
      const res = await axios.put(
        "http://localhost:4000/user-api/articles",
        commentObj,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        setArticle(res.data.payload);
        reset(); // clear input
      }
    } catch (err) {
      console.error(err); // ✅ fixes eslint
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>
          {article.title}
        </h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            ✍️ {article.author?.firstName || "Author"}
          </div>
          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button
            className={editBtn}
            onClick={() => editArticle(article)}
          >
            Edit
          </button>

          <button
            className={deleteBtn}
            onClick={toggleArticleStatus}
          >
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      {/* USER comment form */}
      {user?.role === "USER" && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)}>
            <input
              type="text"
              {...register("comment")}
              className={inputClass}
              placeholder="Write your comment here..."
            />
            <button
              type="submit"
              className="bg-amber-600 text-white px-5 py-2 rounded-2xl mt-5"
            >
              Add comment
            </button>
          </form>
        </div>
      )}

      {/* ✅ Comments */}
      {article.comments?.map((comment) => (
        <div
          key={comment._id} // ✅ FIXED key warning
          className="bg-gray-300 p-6 rounded-2xl mt-4"
        >
          <p className="uppercase text-pink-400 font-bold mb-3">
            {comment.user?.email}
          </p>
          <p>{comment.comment}</p>
        </div>
      ))}

      {/* Footer */}
      <div className={articleFooter}>
        Last updated: {formatDate(article.updatedAt)}
      </div>
    </div>
  );
}

export default ArticleByID;