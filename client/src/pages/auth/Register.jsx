import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import { LoaderContext } from "../../context/LoaderContext.jsx"; // ✅ Import loader context
import {
  EnvelopeIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const Register = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useContext(UserContext);
  const { loading, setLoading } = useContext(LoaderContext); // ✅ Use loader context

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    try {
      setLoading(true); // ✅ Trigger global loader
      const { data } = await axios.post(
        `${URI}/api/auth/register`,
        { name, email, password, role },
        { withCredentials: true }
      );

      if (data.success) {
        setUser(data.data);
        toast.success(data.message);
        navigate("/verify-account");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Registration failed";
      console.error("Registration Error:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false); // ✅ Turn off loader
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 px-4 py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Create Your Account</h1>
          <p className="text-sm text-gray-600 mt-2">
            Join us to explore amazing stays and host your own!
          </p>
        </div>

        <form onSubmit={registerUser} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent"
                placeholder="Enter Full Name"
              />
            </div>
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            <Link
              to="/reset-password"
              className="float-right text-xs text-indigo-700 hover:text-blue-600 cursor-pointer transition-all duration-150 underline-offset-2 hover:underline active:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Choose your role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
