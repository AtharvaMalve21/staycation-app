import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { LoaderContext } from "../context/LoaderContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  PencilIcon,
  CheckBadgeIcon,
  XCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const MyProfile = () => {
  const { user, setIsLoggedIn, setUser } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);
  const [totalBookings, setTotalBookings] = useState("");
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const logoutUserAccount = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/auth/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(false);
        setUser(null);
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/booking`, {
        withCredentials: true,
      });
      if (data.success) {
        setTotalBookings(data.data.length);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const profilePic = user?.additionalDetails?.profilePic;
  const gender = user?.additionalDetails?.gender;
  const phone = user?.additionalDetails?.phone;
  const city = user?.additionalDetails?.city;

  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full p-8 space-y-6 animate-fade-in">
        {/* Profile Image with Badge */}
        <div className="flex justify-center relative">
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-full flex items-center justify-center bg-blue-200 text-blue-600 font-bold text-3xl shadow-md border-4 border-blue-400">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {user?.isAccountVerified && (
              <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-md">
                <CheckBadgeIcon className="w-6 h-6 text-green-500" />
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-1">
          <div className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wider">
            {user?.role}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>

          <div className="text-sm text-gray-600 flex justify-center items-center gap-2">
            <EnvelopeIcon className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>

          {phone && (
            <div className="text-sm text-gray-600 flex justify-center items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              <span>{phone}</span>
            </div>
          )}

          {gender && (
            <div className="text-sm text-gray-500 capitalize">
              Gender: {gender}
            </div>
          )}

          {city && (
            <div className="text-sm text-gray-500 capitalize">City: {city}</div>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-sm text-gray-700 space-y-1 text-center">
          {user?.role === "user" && (
            <p>
              <span className="font-medium text-blue-600">{totalBookings}</span>{" "}
              Booking(s) Made
            </p>
          )}
          <p className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <CalendarDaysIcon className="w-4 h-4" />
            Joined: {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Verification Status */}
        <div className="flex justify-center items-center gap-2 text-sm font-medium">
          {user?.isAccountVerified ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckBadgeIcon className="w-5 h-5" /> Verified Account
            </span>
          ) : (
            <span className="text-gray-400 flex items-center gap-1">
              <XCircleIcon className="w-5 h-5" /> Not Verified
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/account/profile/edit")}
            className="w-full flex items-center justify-center gap-2 text-blue-600 border border-blue-600 rounded-lg py-2 hover:bg-blue-50 transition"
          >
            <PencilIcon className="w-5 h-5" /> Edit Profile
          </button>

          <button
            onClick={logoutUserAccount}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

// Logout Icon
const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
    />
  </svg>
);
