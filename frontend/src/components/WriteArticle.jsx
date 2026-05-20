import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  errorClass,
  loadingClass,
} from "../styles/common";

import { useAuth } from "../store/authStore";
import BASE_URL from "../utils/baseURL";

function WriteArticle() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

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
  const submitArticle = async (
    articleObj
  ) => {

    setLoading(true);

    try {

      // ADD AUTHOR
      articleObj.author =
        currentUser._id;

      // GET TOKEN
      const token =
        localStorage.getItem(
          "token"
        );

      // API CALL
      await axios.post(
        `${BASE_URL}/author-api/articles`,
        articleObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Article published successfully!"
      );

      reset();

      navigate(
        "/author-profile/articles"
      );

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

    <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

        {/* TOP HEADER */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-10 py-10 text-white">

          <h1 className="text-4xl font-bold">
            Write New Article
          </h1>

          <p className="mt-3 text-blue-100 text-lg">
            Share your ideas, tutorials, and knowledge with readers.
          </p>

        </div>

        {/* FORM */}
        <div className="p-10">

          <form
            onSubmit={handleSubmit(
              submitArticle
            )}
            className="space-y-8"
          >

            {/* TITLE */}
            <div>

              <label className="block text-lg font-semibold text-gray-700 mb-3">

                Article Title

              </label>

              <input
                type="text"
                placeholder="Enter article title"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                {...register("title", {
                  required:
                    "Title is required",
                  minLength: {
                    value: 5,
                    message:
                      "Title must be at least 5 characters",
                  },
                })}
              />

              {
                errors.title && (
                  <p className={errorClass}>
                    {
                      errors.title
                        .message
                    }
                  </p>
                )
              }

            </div>

            {/* CATEGORY */}
            <div>

              <label className="block text-lg font-semibold text-gray-700 mb-3">

                Category

              </label>

              <select
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                {...register(
                  "category",
                  {
                    required:
                      "Category is required",
                  }
                )}
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

              {
                errors.category && (
                  <p className={errorClass}>
                    {
                      errors.category
                        .message
                    }
                  </p>
                )
              }

            </div>

            {/* CONTENT */}
            <div>

              <label className="block text-lg font-semibold text-gray-700 mb-3">

                Content

              </label>

              <textarea
                rows="12"
                placeholder="Write your article content..."
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                {...register("content", {
                  required:
                    "Content is required",
                  minLength: {
                    value: 50,
                    message:
                      "Content must be at least 50 characters",
                  },
                })}
              />

              {
                errors.content && (
                  <p className={errorClass}>
                    {
                      errors.content
                        .message
                    }
                  </p>
                )
              }

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-md transition"
            >

              {
                loading
                  ? "Publishing..."
                  : "Publish Article"
              }

            </button>

            {
              loading && (
                <p className={loadingClass}>
                  Publishing article...
                </p>
              )
            }

          </form>

        </div>

      </div>

    </div>
  );
}

export default WriteArticle;