import React, { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      {/* Left Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img src="/airbnb.png" alt="airbnb" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-rose-500">StayEase</h1>
      </Link>

      {/* Center Search */}
      <div className="hidden md:flex items-center space-x-4 border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition cursor-pointer">
        <p className="text-sm font-medium">Anywhere</p>
        <div className="border-l h-5" />
        <p className="text-sm font-medium">Any week</p>
        <div className="border-l h-5" />
        <p className="text-sm text-gray-500">Add guests</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-5 h-5 bg-rose-400 rounded-full p-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      {/* Right User/Menu */}
      <div>
        <Link
          to={user?.role === "user" ? "/user/dashboard" : "/admin/profile"}
          className="flex items-center space-x-3 border px-3 py-2 rounded-full hover:shadow-md transition"
        >
          {/* Menu Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>

          {/* Profile */}
          {user ? (
            <>
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold uppercase text-sm">
                  {user.name?.charAt(0)}
                </div>
              )}
              <p className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                {user.name}
              </p>
            </>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
