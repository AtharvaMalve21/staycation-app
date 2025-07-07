import React, { useState } from "react";

const StepPassword = ({
  newPassword,
  confirmNewPassword,
  setNewPassword,
  setConfirmNewPassword,
  handleResetPassword,
}) => {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form onSubmit={handleResetPassword}>
      {/* New Password */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          New Password
        </label>
        <input
          type={show ? "text" : "password"}
          placeholder="********"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span
          className="absolute right-3 top-[38px] text-sm text-gray-600 cursor-pointer"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Hide" : "Show"}
        </span>
      </div>

      {/* Confirm Password */}
      <div className="mb-6 relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Confirm New Password
        </label>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="********"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span
          className="absolute right-3 top-[38px] text-sm text-gray-600 cursor-pointer"
          onClick={() => setShowConfirm((prev) => !prev)}
        >
          {showConfirm ? "Hide" : "Show"}
        </span>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition"
      >
        Reset Password
      </button>
    </form>
  );
};

export default StepPassword;
