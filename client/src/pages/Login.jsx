import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const Login = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const loginUserAccount = async (ev) => {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        URI + "/api/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setIsLoggedIn(true);
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#1e40af] mb-8">
          Welcome Back
        </h1>
        <form onSubmit={loginUserAccount} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-500" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <LockClosedIcon className="w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="focus:outline-none text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#1e40af] hover:bg-[#1c3aa9] text-white py-2.5 rounded-xl font-semibold transition"
          >
            Log in
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#1e40af] font-medium hover:underline"
            >
              Register now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
