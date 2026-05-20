import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

function Header() {

  const isAuthenticated =
    useAuth(
      (state) =>
        state.isAuthenticated
    );

  const user =
    useAuth(
      (state) =>
        state.currentUser
    );

  const logout =
    useAuth(
      (state) =>
        state.logout
    );

  const navigate =
    useNavigate();

  // LOGOUT
  const handleLogout =
    async () => {

      await logout();

      navigate("/login");
    };

  // PROFILE ROUTE
  const getProfilePath =
    () => {

      if (!user)
        return "/";

      switch (user.role) {

        case "AUTHOR":
          return "/author-profile";

        case "ADMIN":
          return "/admin-profile";

        default:
          return "/user-profile";
      }
    };

  return (

    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() =>
            navigate("/")
          }
          className="flex items-center gap-3 cursor-pointer"
        >

          {/* ICON */}
          <div className="w-11 h-11 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">

            M

          </div>

          {/* BRAND */}
          <div>

            <h1 className="text-2xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">

              MyBlog

            </h1>

            <p className="text-xs text-gray-400 -mt-1">
              Modern Blog Platform
            </p>

          </div>

        </div>

        {/* NAVIGATION */}
        <div className="flex items-center gap-4">

          {/* HOME */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600 font-medium transition"
            }
          >
            Home
          </NavLink>

          {/* NOT LOGGED IN */}
          {
            !isAuthenticated && (
              <>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600 font-medium transition"
                  }
                >
                  Register
                </NavLink>

                <NavLink
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
                >
                  Login
                </NavLink>

              </>
            )
          }

          {/* LOGGED IN */}
          {
            isAuthenticated && (
              <>

                {/* PROFILE */}
                <NavLink
                  to={getProfilePath()}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600 font-medium transition"
                  }
                >
                  Profile
                </NavLink>

                {/* USER IMAGE */}
                {
                  user?.profileImageUrl ? (

                    <img
                      src={
                        user.profileImageUrl
                      }
                      alt="profile"
                      className="w-11 h-11 rounded-full object-cover border-2 border-blue-500 shadow-md"
                    />

                  ) : (

                    <div className="w-11 h-11 rounded-full bg-linear-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">

                      {
                        user?.firstName?.charAt(
                          0
                        )
                      }

                    </div>
                  )
                }

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition"
                >
                  Logout
                </button>

              </>
            )
          }

        </div>

      </div>

    </nav>
  );
}

export default Header;