import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext.jsx";
import { LoaderContext } from "../../context/LoaderContext.jsx";


const VerifyAccount = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const { setIsLoggedIn, user } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);

  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((char, idx) => {
      if (!isNaN(char) && idx < 6) {
        newOtp[idx] = char;
      }
    });
    setOtp(newOtp);
    setTimeout(() => {
      const filledLength = pastedData.length;
      if (filledLength < 6) inputRefs.current[filledLength]?.focus();
    }, 10);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) return toast.error("Enter 6-digit OTP");

    try {
      setLoading(true);

      const { data } = await axios.post(
        URI + "/api/auth/verify-account",
        { email: user.email, otp: code },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success) {
        setIsLoggedIn(true);
        toast.success(data.message);
        navigate(data.data.role === "user" ? "/" : "/admin/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-[calc(100vh-78px)] flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 px-4">
      <form onSubmit={handleVerify} className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-xl font-semibold text-center text-blue-700 mb-6">
          Verify Your Account
        </h1>

        <div
          className="flex justify-center gap-3 mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
        >
          Verify Account
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Didn't receive the code?{" "}
          <button type="button" className="text-blue-500 hover:underline">
            Resend OTP
          </button>
        </p>
      </form>
    </div>
  );
};

export default VerifyAccount;
