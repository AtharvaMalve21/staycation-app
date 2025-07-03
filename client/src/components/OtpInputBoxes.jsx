import React, { useEffect, useRef } from "react";

const OtpInputBoxes = ({ otp, setOtp, length = 6 }) => {
    const inputs = useRef([]);

    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        if (!val) return;

        const otpArr = otp.split("");
        otpArr[index] = val[0];
        const newOtp = otpArr.join("");
        setOtp(newOtp);

        if (index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const otpArr = otp.split("");
            if (otpArr[index]) {
                otpArr[index] = "";
                setOtp(otpArr.join(""));
            } else if (index > 0) {
                inputs.current[index - 1]?.focus();
                const otpArr = otp.split("");
                otpArr[index - 1] = "";
                setOtp(otpArr.join(""));
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, length).replace(/[^0-9]/g, "");
        if (pasted.length === length) {
            setOtp(pasted);
            inputs.current[length - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={otp[i] || ""}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                />
            ))}
        </div>
    );
};

export default OtpInputBoxes;
