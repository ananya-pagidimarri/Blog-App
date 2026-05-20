import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  errorClass,
} from "../styles/common";

import { useAuth } from "../store/authStore";

import BASE_URL from "../utils/baseURL";

function WriteArticle() {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const currentUser =
    useAuth(
      (state) =>
        state.currentUser
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // SUBMIT ARTICLE
  const submitArticle =
    async (articleObj) => {

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
          err.response?.data
            ?.message ||
            err.response?.data
              ?.error ||
            "Failed to publish article"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 px-6 py-12 flex justify-center items-start">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">

        {/* HEADER */}
        <div className="mb-10 text-center">

          <h1 className="text-5xl font-bold text-gray-800">
            Write New Article
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Share your ideas and knowledge with readers
          </p>

        </div>

        {/* FORM */}
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
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
              {...register(
                "title",
                {
                  required:
                    "Title is required",
                  minLength: {
                    value: 5,
                    message:
                      "Title must be at least 5 characters",
                  },
                }
              )}
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
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
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
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition resize-none"
              {...register(
                "content",
                {
                  required:
                    "Content is required",
                  minLength: {
                    value: 50,
                    message:
                      "Content must be at least 50 characters",
                  },
                }
              )}
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
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white py-4 rounded-2xl text-xl font-semibold shadow-lg transition"
          >

            {
              loading
                ? "Publishing..."
                : "Publish Article"
            }

          </button>

        </form>

      </div>

    </div>
  );
}

export default WriteArticle;