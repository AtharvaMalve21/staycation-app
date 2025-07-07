import React, { useEffect, useRef } from "react";

const OtpInputBoxes = ({ otp, setOtp, length = 6 }) => {
  const inputs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const otpArr = otp.split("");
    otpArr[index] = val[0]; // only allow 1 digit
    setOtp(otpArr.join(""));

    if (index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      const otpArr = otp.split("");

      if (otpArr[index]) {
        otpArr[index] = "";
        setOtp(otpArr.join(""));
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
        const updatedOtpArr = otp.split("");
        updatedOtpArr[index - 1] = "";
        setOtp(updatedOtpArr.join(""));
      }
    } else if (key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);

    if (!pasted) return;

    const newOtp = pasted.padEnd(length, ""); // fill the rest with blanks
    setOtp(newOtp);

    const nextFocus = Math.min(pasted.length, length - 1);
    inputs.current[nextFocus]?.focus();
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={otp[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
};

export default OtpInputBoxes;
