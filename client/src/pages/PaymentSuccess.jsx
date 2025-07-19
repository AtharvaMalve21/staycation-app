import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10 space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle className="text-green-600" size={56} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-semibold text-green-700">
          Payment Successful!
        </h1>

        <p className="text-gray-600 text-base sm:text-lg">
          Your booking has been confirmed. A confirmation email has been sent.
        </p>

        <Link
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium px-6 py-3 rounded-lg transition-colors duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
