import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-planner-evbn.onrender.com",
});

// ✅ Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.authorization = `Bearer ${token}`; // ✅ THIS LINE IS CRITICAL
  }

  return req;
});

export default API;