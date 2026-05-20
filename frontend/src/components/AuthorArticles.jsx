import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import BASE_URL from "../utils/baseURL";

import {
  articleMeta,
  loadingClass,
  errorClass,
  emptyStateClass,
} from "../styles/common";

function AuthorArticles() {

  const navigate = useNavigate();

  const user = useAuth(
    (state) => state.currentUser
  );

  const [articles, setArticles] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  useEffect(() => {

    if (!user?._id) return;

    const getAuthorArticles =
      async () => {

        setLoading(true);

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await axios.get(
              `${BASE_URL}/author-api/articles/author/${user._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setArticles(
            res.data.payload
          );

        } catch (err) {

          console.log(err);

          setError(
            err.response?.data
              ?.message ||
              err.response?.data
                ?.error ||
              "Failed to fetch articles"
          );

        } finally {

          setLoading(false);
        }
      };

    getAuthorArticles();

  }, [user]);

  const openArticle = (
    article
  ) => {

    navigate(
      `/article/${article._id}`,
      {
        state: article,
      }
    );
  };

  const formatDate = (
    date
  ) => {

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        timeZone:
          "Asia/Kolkata",
        dateStyle: "medium",
      }
    );
  };

  // LOADING
  if (loading) {

    return (
      <p className={loadingClass}>
        Loading articles...
      </p>
    );
  }

  // ERROR
  if (error) {

    return (
      <p className={errorClass}>
        {error}
      </p>
    );
  }

  // EMPTY
  if (articles.length === 0) {

    return (
      <div className={emptyStateClass}>
        You haven't published any articles yet.
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            My Articles
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your published articles
          </p>

        </div>

        <button
          onClick={() =>
            navigate(
              "/author-profile/write-article"
            )
          }
          className="mt-5 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-md transition"
        >
          + New Article
        </button>

      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {articles.map((article) => (

          <div
            key={article._id}
            className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >

            {/* TOP BAR */}
            <div className="h-2 bg-blue-600"></div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col h-full">

              {/* CATEGORY */}
              <span className="bg-blue-100 text-blue-600 text-xs font-semibold uppercase px-3 py-1 rounded-full w-fit mb-4">

                {article.category}

              </span>

              {/* TITLE */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">

                {article.title}

              </h2>

              {/* CONTENT */}
              <p className="text-gray-600 leading-7 mb-6">

                {
                  article.content.slice(
                    0,
                    120
                  )
                }
                ...

              </p>

              {/* FOOTER */}
              <div className="mt-auto flex justify-between items-center">

                <div>

                  <p className="text-sm text-gray-400">
                    Published
                  </p>

                  <p className={articleMeta}>
                    {formatDate(
                      article.createdAt
                    )}
                  </p>

                </div>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
                  onClick={() =>
                    openArticle(article)
                  }
                >
                  Read →
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AuthorArticles;