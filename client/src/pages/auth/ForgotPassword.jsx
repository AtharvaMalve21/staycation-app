import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';


const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const URI = import.meta.env.VITE_BACKEND_URI;

  const forgotPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        URI + "/api/auth/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/reset-password");
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-75px)] flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-600">Forgot Password</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Email Input */}
        <form onSubmit={forgotPassword} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="absolute inset-y-0 left-3 top-6 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75V6.75A2.25 2.25 0 0014.25 4.5H5.25A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 19.5h9a2.25 2.25 0 002.25-2.25v-1.5M16.5 15l4.5-4.5m0 0L16.5 6m4.5 4.5H9"
                />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Send Reset Link
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-sm">
          <span className="text-gray-600">Remember your password?</span>{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
