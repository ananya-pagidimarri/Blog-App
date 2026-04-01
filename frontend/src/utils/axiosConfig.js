import axios from "axios";

export const axiosData = axios.create({
  baseURL: "https://blog-app-5ozu.vercel.app/api",
  withCredentials: true,
});