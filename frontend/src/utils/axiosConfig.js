import axios from "axios";

export const axiosData = axios.create({
  baseURL: "http://localhost:4000"
});