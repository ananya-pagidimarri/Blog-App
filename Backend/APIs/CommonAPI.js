import { create } from "zustand";
import axios from "axios";
import BASE_URL from "../utils/baseURL";

const savedUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("currentUser") || "null")
    : null;

export const useAuth = create((set) => ({
  currentUser: savedUser,
  loading: false,
  isAuthenticated: Boolean(savedUser),
  error: null,

  // ================= LOGIN =================
  login: async (userCredObj) => {
    try {

      set({
        loading: true,
        error: null,
      });

      // login request
      const res = await axios.post(
        `${BASE_URL}/common-api/login`,
        userCredObj,
        {
          withCredentials: true,
        }
      );

      const userData = res.data.payload;

      // save user in localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify(userData)
      );

      // update state
      set({
        currentUser: userData,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

    } catch (err) {

      console.log("Login error:", err);

      localStorage.removeItem("currentUser");

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
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

      await axios.get(
        `${BASE_URL}/common-api/logout`,
        {
          withCredentials: true,
        }
      );

      // clear local storage
      localStorage.removeItem("currentUser");

      // clear state
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

    } catch (err) {

      console.log("Logout error:", err);

      localStorage.removeItem("currentUser");

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error:
          err.response?.data?.message ||
          "Logout failed",
      });
    }
  },

  // ================= CHECK AUTH =================
  checkAuth: async () => {

    try {

      set({
        loading: true,
      });

      const res = await axios.get(
        `${BASE_URL}/common-api/check-auth`,
        {
          withCredentials: true,
        }
      );

      const user = res.data.payload;

      // store user
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

      console.log("Check auth error:", err);

      // remove invalid user
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