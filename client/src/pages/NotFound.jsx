import React from "react";
import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-center px-4">
      <ExclamationTriangleIcon className="w-20 h-20 text-blue-500 mb-4" />
      <h1 className="text-4xl font-bold text-blue-600 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">Sorry, the page you are looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
