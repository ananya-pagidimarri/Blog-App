import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

import { useAuth } from "../store/authStore";

import BASE_URL from "../utils/baseURL";

function WriteArticle() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // ================= SUBMIT ARTICLE =================
  const submitArticle = async (articleObj) => {

    setLoading(true);

    try {

      // ADD AUTHOR ID
      articleObj.author = currentUser._id;

      // GET TOKEN
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      // API CALL
      const res = await axios.post(
        `${BASE_URL}/author-api/articles`,
        articleObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("article response", res.data);

      toast.success(
        "Article published successfully!"
      );

      reset();

      navigate("/author-profile/articles");

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to publish article"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className={formCard}>

      <h2 className={formTitle}>
        Write New Article
      </h2>

      <form onSubmit={handleSubmit(submitArticle)}>

        {/* TITLE */}
        <div className={formGroup}>

          <label className={labelClass}>
            Title
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter article title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 5,
                message:
                  "Title must be at least 5 characters",
              },
            })}
          />

          {errors.title && (
            <p className={errorClass}>
              {errors.title.message}
            </p>
          )}

        </div>

        {/* CATEGORY */}
        <div className={formGroup}>

          <label className={labelClass}>
            Category
          </label>

          <select
            className={inputClass}
            {...register("category", {
              required: "Category is required",
            })}
          >

            <option value="">
              Select category
            </option>

            <option value="technology">
              Technology
            </option>

            <option value="programming">
              Programming
            </option>

            <option value="ai">
              AI
            </option>

            <option value="web-development">
              Web Development
            </option>

          </select>

          {errors.category && (
            <p className={errorClass}>
              {errors.category.message}
            </p>
          )}

        </div>

        {/* CONTENT */}
        <div className={formGroup}>

          <label className={labelClass}>
            Content
          </label>

          <textarea
            rows="8"
            className={inputClass}
            placeholder="Write your article content..."
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 50,
                message:
                  "Content must be at least 50 characters",
              },
            })}
          />

          {errors.content && (
            <p className={errorClass}>
              {errors.content.message}
            </p>
          )}

        </div>

        {/* SUBMIT */}
        <button
          className={submitBtn}
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Publishing..."
            : "Publish Article"}
        </button>

        {loading && (
          <p className={loadingClass}>
            Publishing article...
          </p>
        )}

      </form>
    </div>
  );
}

export default WriteArticle;