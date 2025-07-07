import React from "react";

const StepEmail = ({ email, setEmail, handleSendOtp }) => {
  return (
    <form onSubmit={handleSendOtp}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Enter your registered email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Send OTP
      </button>
    </form>
  );
};

export default StepEmail;
