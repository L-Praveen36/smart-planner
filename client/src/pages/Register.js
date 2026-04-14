import API from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.post("/register", {
        name,
        email,
        password,
      });

      toast.success("Registered successfully!");

      // ✅ redirect to login
      navigate("/");

    } catch (err) {
      console.error(err);
      toast.error("Error registering");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}   // ✅ FIX
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl mb-4 font-bold">Register</h2>

        <input
          value={name}   // ✅ controlled input
          placeholder="Name"
          className="w-full p-2 mb-3 border"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          value={email}
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          value={password}
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"   // ✅ IMPORTANT
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;