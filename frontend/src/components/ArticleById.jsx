import { useParams, useLocation, useNavigate } from "react-router-dom";
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

import BASE_URL from "../utils/baseURL";

function ArticleById() {

  const { id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const user = useAuth(
    (state) => state.currentUser
  );

  const [article, setArticle] =
    useState(location.state || null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  // ================= FETCH ARTICLE =================
  useEffect(() => {

    if (location.state) return;

    const getArticle = async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          `${BASE_URL}/user-api/articles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setArticle(res.data.payload);

      } catch (err) {

        console.log(err);

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch article"
        );

      } finally {

        setLoading(false);
      }
    };

    getArticle();

  }, [id, location.state]);

  // ================= FORMAT DATE =================
  const formatDate = (date) => {

    return new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ================= DELETE / RESTORE =================
  const toggleArticleStatus = async () => {

    const newStatus =
      !article.isArticleActive;

    const confirmMsg = newStatus
      ? "Restore this article?"
      : "Delete this article?";

    if (!window.confirm(confirmMsg))
      return;

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.patch(
        `${BASE_URL}/author-api/articles/${id}/status`,
        {
          isArticleActive: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setArticle(res.data.payload);

      toast.success(res.data.message);

    } catch (err) {

      console.log(err);

      const msg =
        err.response?.data?.message;

      toast.error(
        msg || "Operation failed"
      );
    }
  };

  // ================= EDIT ARTICLE =================
  const editArticle = (articleObj) => {

    navigate("/edit-article", {
      state: articleObj,
    });
  };

  // ================= ADD COMMENT =================
  const addComment = async (
    commentObj
  ) => {

    commentObj.articleId =
      article._id;

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.put(
        `${BASE_URL}/user-api/articles`,
        commentObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {

        toast.success(res.data.message);

        setArticle(res.data.payload);

        reset();
      }

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to add comment"
      );
    }
  };

  // ================= LOADING =================
  if (loading) {

    return (
      <p className={loadingClass}>
        Loading article...
      </p>
    );
  }

  // ================= ERROR =================
  if (error) {

    return (
      <p className={errorClass}>
        {error}
      </p>
    );
  }

  // ================= EMPTY =================
  if (!article) return null;

  // ================= UI =================
  return (

    <div className={articlePageWrapper}>

      {/* HEADER */}
      <div className={articleHeader}>

        <span className={articleCategory}>
          {article.category}
        </span>

        <h1
          className={`${articleMainTitle} uppercase`}
        >
          {article.title}
        </h1>

        <div className={articleAuthorRow}>

          <div className={authorInfo}>
            ✍️{" "}
            {article.author?.firstName ||
              "Author"}
          </div>

          <div>
            {
              formatDate(
                article.createdAt
              )
            }
          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className={articleContent}>
        {article.content}
      </div>

      {/* AUTHOR ACTIONS */}
      {user?.role === "AUTHOR" && (

        <div className={articleActions}>

          <button
            className={editBtn}
            onClick={() =>
              editArticle(article)
            }
          >
            Edit
          </button>

          <button
            className={deleteBtn}
            onClick={
              toggleArticleStatus
            }
          >
            {
              article.isArticleActive
                ? "Delete"
                : "Restore"
            }
          </button>

        </div>
      )}

      {/* USER COMMENT */}
      {user?.role === "USER" && (

        <div className={articleActions}>

          <form
            onSubmit={handleSubmit(
              addComment
            )}
          >

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

      {/* COMMENTS */}
      {article.comments?.map(
        (comment) => (

          <div
            key={comment._id}
            className="bg-gray-300 p-6 rounded-2xl mt-4"
          >

            <p className="uppercase text-pink-400 font-bold mb-3">
              {comment.user?.email}
            </p>

            <p>
              {comment.comment}
            </p>

          </div>
        )
      )}

      {/* FOOTER */}
      <div className={articleFooter}>

        Last updated:{" "}
        {formatDate(article.updatedAt)}

      </div>

    </div>
  );
}

export default ArticleById;