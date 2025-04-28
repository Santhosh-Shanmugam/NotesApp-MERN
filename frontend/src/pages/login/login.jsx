import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbarhome";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter the Email.");
      return;
    }
    if (!password) {
      setError("Please enter the Password.");
      return;
    }

    setError("");

    // Calling Login API
    try {
      const response = await axios.post(
        "https://notesapp-7sbx.onrender.com/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", `Bearer ${response.data.token}`);
        localStorage.setItem("data", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              placeholder="E-mail"
              className="w-full text-sm bg-transparent border border-gray-300 px-5 py-3 rounded mb-4 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button
              type="submit"
              className="w-full text-sm bg-primary text-white p-2 rounded my-1"
            >
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not Registered ?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
