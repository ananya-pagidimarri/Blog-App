import { create } from "zustand";
import axios from "axios";
import BASE_URL from "../utils/baseURL";

const savedUser =
  typeof window !== "undefined"
    ? JSON.parse(
        localStorage.getItem("currentUser") || "null"
      )
    : null;

export const useAuth = create((set) => ({

  currentUser: savedUser,

  loading: false,

  isAuthenticated: Boolean(savedUser),

  error: null,

  // ================= LOGIN =================
  login: async (userCredWithRole) => {

    const { ...userCredObj } = userCredWithRole;

    try {

      set({
        loading: true,
        error: null,
      });

      // LOGIN API
      const res = await axios.post(
        `${BASE_URL}/common-api/login`,
        userCredObj,
        {
          withCredentials: true,
        }
      );

      console.log("login response", res.data);

      // GET USER + TOKEN
      const userData = res.data.payload.user;

      const token = res.data.payload.token;

      // SAVE TO LOCAL STORAGE
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(userData)
      );

      // UPDATE STATE
      set({
        currentUser: userData,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

    } catch (err) {

      console.log("login error", err);

      localStorage.removeItem("token");

      localStorage.removeItem("currentUser");

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed",
      });
    }
  },

  // ================= LOGOUT =================
  logout: async () => {

    try {

      set({
        loading: true,
        error: null,
      });

      // GET TOKEN
      const token = localStorage.getItem("token");

      // LOGOUT API
      await axios.get(
        `${BASE_URL}/common-api/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // CLEAR STORAGE
      localStorage.removeItem("token");

      localStorage.removeItem("currentUser");

      // CLEAR STATE
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

    } catch (err) {

      console.log("logout error", err);

      localStorage.removeItem("token");

      localStorage.removeItem("currentUser");

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error:
          err.response?.data?.error ||
          "Logout failed",
      });
    }
  },

  // ================= CHECK AUTH =================
  checkAuth: async () => {

  try {

    const token = localStorage.getItem("token");

    // NO TOKEN -> SKIP API CALL
    if (!token) {

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
      });

      return;
    }

    set({
      loading: true,
    });

    // API CALL
    const res = await axios.get(
      `${BASE_URL}/common-api/check-auth`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("check auth response", res.data);

    const user = res.data.payload;

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    set({
      currentUser: user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

  } catch (err) {

    console.log("check auth error", err);

    localStorage.removeItem("token");

    localStorage.removeItem("currentUser");

    set({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }
},

}));