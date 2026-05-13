import { createRoot } from "react-dom/client";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";

// IMPORTANT FOR COOKIES
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <App />
);