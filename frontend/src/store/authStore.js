import { create } from "zustand";
import axios from "axios";

const savedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentUser") || "null") : null;

export const useAuth = create((set) => ({
  currentUser: savedUser,
  loading: false,
  isAuthenticated: Boolean(savedUser),
  error: null,
  login: async (userCredWithRole) => {
    const { ...userCredObj } = userCredWithRole;
    try {
      //set loading true
      set({ loading: true, error: null });
      //make api call
      let res = await axios.post("https://blog-app-5ozu.vercel.app/common-api/login", userCredObj, { withCredentials: true });
      // console.log("res is ", res);
      //update state
      const userData = res.data.payload;
      localStorage.setItem("currentUser", JSON.stringify(userData));

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: userData,
      });
    } catch (err) {
      console.log("err is ", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        //error: err,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },
  logout: async () => {
    try {
      //set loading state
      set({ loading: true, error: null });
      //make logout api req
      await axios.get("https://blog-app-5ozu.vercel.app/common-api/logout", { withCredentials: true });
      //update state
      localStorage.removeItem("currentUser");
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },

// restore login
  checkAuth: async () => {
    const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentUser") || "null") : null;
    if (storedUser) {
      set({ currentUser: storedUser, isAuthenticated: true, loading: false });
      return;
    }

    // Skip API call - rely on localStorage for persistence
    set({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
    });
  },
}));