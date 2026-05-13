import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

import BASE_URL from "../utils/baseURL";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
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

        console.log("TOKEN:", token);

        // API CALL
        const res = await axios.get(
          `${BASE_URL}/user-api/articles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "articles response",
          res.data
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

    <div>

      {error && (
        <p className={errorClass}>
          {error}
        </p>
      )}

      {/* PROFILE SECTION */}
      <div className="text-end">

        <p className="text-2xl">
          Welcome, {currentUser?.firstName}
        </p>

        {
          currentUser?.profileImageUrl ? (

            <img
              src={
                currentUser.profileImageUrl
              }
              className="w-14 h-14 mr-2 rounded-full block ms-auto object-cover"
              alt="profile"
            />

          ) : (

            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center ms-auto mr-2 mt-2">
              👤
            </div>
          )
        }

      </div>

      {/* LOGOUT BUTTON */}
      <div className="flex justify-end mb-6 mt-3">

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

      {/* ARTICLES */}
      <div className={articleGrid}>

        {articles.length === 0 ? (

          <p>No articles found</p>

        ) : (

          articles.map((articleObj) => (

            <div
              className={articleCardClass}
              key={articleObj._id}
            >

              <div className="flex flex-col h-full">

                {/* TOP CONTENT */}
                <div>

                  <p className={articleTitle}>
                    {articleObj.title}
                  </p>

                  <p>
                    {
                      articleObj.content.slice(
                        0,
                        80
                      )
                    }
                    ...
                  </p>

                  <p className={timestampClass}>
                    {
                      formatDateIST(
                        articleObj.createdAt
                      )
                    }
                  </p>

                </div>

                {/* BUTTON */}
                <button
                  className={`${ghostBtn} mt-auto pt-4`}
                  onClick={() =>
                    navigateToArticleByID(
                      articleObj
                    )
                  }
                >
                  Read Article →
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default UserProfile;