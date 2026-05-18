import { Link } from "react-router-dom";
import { PenSquare, Users, BookOpen, TrendingUp } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 md:px-20 py-6 border-b border-white/10 backdrop-blur-lg">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          BlogSphere
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/30"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-20 py-24 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Content */}
        <div className="max-w-2xl z-10">
          <p className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm mb-6">
            ✨ Share your ideas with the world
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Write. <br />
            Inspire. <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Connect.
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-300 leading-relaxed">
            A modern blogging platform where creators, developers, and writers
            can publish stories, share knowledge, and build communities.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:scale-105"
            >
              Start Writing
            </Link>

            <Link
              to="/blogs"
              className="px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/10 font-semibold text-lg transition-all duration-300"
            >
              Explore Blogs
            </Link>
          </div>
        </div>

        {/* Right Card */}
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>

          <div className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              
              <div className="bg-slate-800/70 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-500 p-3 rounded-xl">
                    <PenSquare size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl">Create Articles</h3>
                    <p className="text-gray-400 text-sm">
                      Write beautiful blogs with ease.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/70 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <Users size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl">Build Community</h3>
                    <p className="text-gray-400 text-sm">
                      Connect with readers and creators.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/70 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <TrendingUp size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl">Grow Faster</h3>
                    <p className="text-gray-400 text-sm">
                      Share your knowledge with the world.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">
            Why Choose BlogSphere?
          </h2>

          <p className="text-gray-400 text-lg">
            Everything you need to create an amazing blogging experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-cyan-400/40">
            <div className="bg-cyan-500/20 w-fit p-4 rounded-2xl mb-6">
              <BookOpen className="text-cyan-400" size={32} />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Rich Content
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Create blogs with images, formatting, and engaging storytelling
              tools.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-blue-400/40">
            <div className="bg-blue-500/20 w-fit p-4 rounded-2xl mb-6">
              <Users className="text-blue-400" size={32} />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Community Driven
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Engage with readers through comments, likes, and discussions.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-purple-400/40">
            <div className="bg-purple-500/20 w-fit p-4 rounded-2xl mb-6">
              <TrendingUp className="text-purple-400" size={32} />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Trending Topics
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Discover what’s popular and keep your audience engaged.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-20 pb-24">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-black">
            Start Your Blogging Journey Today
          </h2>

          <p className="text-black/80 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of creators sharing stories, ideas, and knowledge on
            BlogSphere.
          </p>

          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-black text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300"
          >
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;