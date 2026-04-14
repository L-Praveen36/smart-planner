import { useState } from "react";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/login", {
      email,
      password,
    });

    const token = res.data.token;

    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    setUser(decoded); // ✅ IMPORTANT

    toast.success("Login successful!");
    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err);
    toast.error("Login failed");
  }
};

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}  // ✅ FIX HERE
        className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl w-96 border border-white/20"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          value={email}   // ✅ controlled input
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}  // ✅ controlled input
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"   // ✅ IMPORTANT
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;