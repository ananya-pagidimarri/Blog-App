import { Link } from "react-router-dom";
import {
  PenSquare,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";

function Home() {

  return (

    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-hidden">

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
              M
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                MyBlog
              </h1>

              <p className="text-xs text-gray-500 -mt-1">
                Share ideas with the world
              </p>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-4">

            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
            >
              Get Started
            </Link>

          </div>

        </div>

      </nav>

      {/* ================= HERO SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>

          <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
            ✨ Modern Blogging Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900">

            Write.
            <br />

            Share.
            <br />

            <span className="text-blue-600">
              Inspire.
            </span>

          </h1>

          <p className="mt-8 text-lg text-gray-600 leading-relaxed max-w-xl">

            Create beautiful blogs, share your ideas,
            connect with readers, and grow your audience
            on a modern blogging platform built for creators.

          </p>

          <div className="flex flex-wrap gap-5 mt-10">

            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition hover:scale-105"
            >
              Start Writing
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl border border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white font-semibold text-lg transition"
            >
              Explore Blogs
            </Link>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative">

          <div className="absolute inset-0 bg-blue-200 blur-3xl opacity-40 rounded-full"></div>

          <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">

            <div className="space-y-6">

              {/* CARD 1 */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 hover:shadow-md transition">

                <div className="flex items-center gap-4">

                  <div className="bg-blue-600 p-3 rounded-xl text-white">
                    <PenSquare size={24} />
                  </div>

                  <div>

                    <h3 className="font-bold text-xl text-gray-900">
                      Create Articles
                    </h3>

                    <p className="text-gray-600 text-sm">
                      Write and publish blogs beautifully.
                    </p>

                  </div>

                </div>

              </div>

              {/* CARD 2 */}
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 hover:shadow-md transition">

                <div className="flex items-center gap-4">

                  <div className="bg-indigo-600 p-3 rounded-xl text-white">
                    <Users size={24} />
                  </div>

                  <div>

                    <h3 className="font-bold text-xl text-gray-900">
                      Build Community
                    </h3>

                    <p className="text-gray-600 text-sm">
                      Connect with readers and creators.
                    </p>

                  </div>

                </div>

              </div>

              {/* CARD 3 */}
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 hover:shadow-md transition">

                <div className="flex items-center gap-4">

                  <div className="bg-purple-600 p-3 rounded-xl text-white">
                    <TrendingUp size={24} />
                  </div>

                  <div>

                    <h3 className="font-bold text-xl text-gray-900">
                      Grow Faster
                    </h3>

                    <p className="text-gray-600 text-sm">
                      Reach more readers and share knowledge.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Why Choose MyBlog?
          </h2>

          <p className="text-gray-600 text-lg">
            Everything you need for a modern blogging experience.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* FEATURE 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition">

            <div className="bg-blue-100 w-fit p-4 rounded-2xl mb-6">
              <BookOpen
                className="text-blue-600"
                size={32}
              />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Rich Content
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Write engaging blogs with formatting and
              beautiful presentation.
            </p>

          </div>

          {/* FEATURE 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition">

            <div className="bg-indigo-100 w-fit p-4 rounded-2xl mb-6">
              <Users
                className="text-indigo-600"
                size={32}
              />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Community Driven
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Interact through comments and discussions.
            </p>

          </div>

          {/* FEATURE 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition">

            <div className="bg-purple-100 w-fit p-4 rounded-2xl mb-6">
              <TrendingUp
                className="text-purple-600"
                size={32}
              />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Trending Topics
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Discover popular blogs and stay updated.
            </p>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">

        <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center shadow-2xl">

          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Start Your Blogging Journey Today
          </h2>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">

            Join creators sharing stories, ideas,
            tutorials, and experiences with readers worldwide.

          </p>

          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg hover:scale-105 transition"
          >
            Join Now
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;