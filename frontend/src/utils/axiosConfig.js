import axios from "axios";

export const axiosData = axios.create({
  baseURL: "https://blog-backend1-yekw.onrender.com",
  withCredentials: true,
});