import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

import BASE_URL from "../utils/baseURL";

import {
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";

function UserProfile() {

  const logout = useAuth(
    (state) => state.logout
  );

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [articles, setArticles] =
    useState([]);

  // ================= GET ARTICLES =================
  useEffect(() => {

    const getArticles = async () => {

      try {

        setLoading(true);

        // GET TOKEN
        const token =
          localStorage.getItem("token");

        // API CALL
        const res = await axios.get(
          `${BASE_URL}/user-api/articles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setArticles(res.data.payload);

      } catch (err) {

        console.log(err);

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

    getArticles();

  }, []);

  // ================= FORMAT DATE =================
  const formatDateIST = (date) => {

    return new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ================= LOGOUT =================
  const onLogout = async () => {

    await logout();

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  // ================= NAVIGATE ARTICLE =================
  const navigateToArticleByID = (
    articleObj
  ) => {

    navigate(
      `/article/${articleObj._id}`,
      {
        state: articleObj,
      }
    );
  };

  // ================= LOADING =================
  if (loading) {

    return (
      <p className={loadingClass}>
        Loading articles...
      </p>
    );
  }

  // ================= UI =================
  return (

    <div className="min-h-screen bg-gray-100 px-6 py-10">

      {/* ERROR */}
      {error && (
        <p className={`${errorClass} mb-6`}>
          {error}
        </p>
      )}

      {/* PROFILE HEADER */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8 mb-12 flex flex-col md:flex-row justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-6">

          {
            currentUser?.profileImageUrl ? (

              <img
                src={currentUser.profileImageUrl}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
                alt="profile"
              />

            ) : (

              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-5xl">
                👤
              </div>
            )
          }

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              Welcome, {currentUser?.firstName}
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Explore articles and enhance your knowledge
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <button
          className="mt-6 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl shadow-md transition duration-300"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

      {/* EMPTY */}
      {
        articles.length === 0 ? (

          <div className="text-center text-gray-500 text-lg mt-20">
            No articles found
          </div>

        ) : (

          <>
            {/* HEADING */}
            <div className="max-w-7xl mx-auto mb-8">

              <h2 className="text-3xl font-bold text-gray-800">
                Latest Articles
              </h2>

              <p className="text-gray-500 mt-2">
                Read and explore articles from different categories
              </p>

            </div>

            {/* ARTICLES GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {
                articles.map((articleObj) => (

                  <div
                    key={articleObj._id}
                    className="group bg-white rounded-3xl border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                  >

                    {/* TOP BAR */}
                    <div className="h-3 bg-linear-to-r from-blue-500 to-purple-500"></div>

                    {/* CONTENT */}
                    <div className="p-6 flex flex-col h-full">

                      {/* CATEGORY */}
                      <div className="mb-4">

                        <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                          {articleObj.category || "Article"}
                        </span>

                      </div>

                      {/* TITLE */}
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-snug group-hover:text-blue-600 transition">

                        {articleObj.title}

                      </h2>

                      {/* CONTENT */}
                      <p className="text-gray-600 leading-7 mb-6">

                        {articleObj.content.slice(0, 140)}...

                      </p>

                      {/* FOOTER */}
                      <div className="mt-auto flex items-center justify-between">

                        {/* DATE */}
                        <div>

                          <p className="text-sm text-gray-400">
                            Published
                          </p>

                          <p className={timestampClass}>
                            {formatDateIST(articleObj.createdAt)}
                          </p>

                        </div>

                        {/* BUTTON */}
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md transition"
                          onClick={() =>
                            navigateToArticleByID(articleObj)
                          }
                        >
                          Read →
                        </button>

                      </div>

                    </div>

                  </div>
                ))
              }

            </div>
          </>
        )
      }

    </div>
  );
}

export default UserProfile;