import React from "react";
import OtpInputBoxes from "../../../components/OtpInputBoxes";

const StepOtp = ({ otp, setOtp, setStep }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-gray-700 text-center">
        Enter the 6-digit OTP sent to your email
      </label>
      <OtpInputBoxes otp={otp} setOtp={setOtp} length={6} />

      <p className="text-sm text-center text-gray-500 mt-3">
        Didn't receive OTP?{" "}
        <span
          className="text-blue-600 cursor-pointer font-medium hover:underline"
          onClick={() => {
            setStep(1);
            setOtp("");
          }}
        >
          Resend
        </span>
      </p>
    </div>
  );
};

export default StepOtp;
