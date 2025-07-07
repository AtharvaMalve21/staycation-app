import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import StepEmail from "./steps/StepEmail";
import StepOtp from "./steps/StepOtp";
import StepPassword from "./steps/StepPassword";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${URI}/api/auth/forgot-password`, { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email,
        otp,
        newPassword,
        confirmNewPassword,
      };

      const { data } = await axios.post(`${URI}/api/auth/reset-password`, payload);

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Reset Your Password
        </h2>

        {step === 1 && (
          <StepEmail
            email={email}
            setEmail={setEmail}
            handleSendOtp={handleSendOtp}
          />
        )}
        {step === 2 && (
          <>
            <StepOtp otp={otp} setOtp={setOtp} setStep={setStep} />
            <StepPassword
              newPassword={newPassword}
              confirmNewPassword={confirmNewPassword}
              setNewPassword={setNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              handleResetPassword={handleResetPassword}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
