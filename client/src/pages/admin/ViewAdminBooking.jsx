import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import { LoaderContext } from "../../context/LoaderContext.jsx";
import { UsersIcon } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

const ViewAdminBooking = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [status, setStatus] = useState("");

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/booking/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        setBooking(data.data);
        setStatus(data.data.status);
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    const confirmed = window.confirm("Are you sure you want to update the booking status?");
    if (!confirmed) return;

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${URI}/api/admin/bookings/${id}/status`,
        { status },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Booking status updated successfully");
        setBooking(data.data);
        navigate("/admin/bookings");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [isLoggedIn]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      booking?.place?.photos ? (prev + 1) % booking.place.photos.length : 0
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      booking?.place?.photos
        ? (prev - 1 + booking.place.photos.length) % booking.place.photos.length
        : 0
    );
  };

  const statusOptions = ["pending", "confirmed", "completed", "cancelled"];

  if (!booking) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Booking details loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 font-sans">
      {/* Image slider */}
      <div className="relative w-full h-[420px] overflow-hidden rounded-3xl shadow-lg">
        {booking.place?.photos?.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-500 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        <button
          className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          onClick={prevSlide}
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-800" />
        </button>
        <button
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          onClick={nextSlide}
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-800" />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {booking.place?.photos?.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Booking & Status Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center transition duration-300 hover:shadow-lg hover:scale-[1.02]">
          {booking.user?.additionalDetails?.profilePic ? (
            <img
              src={booking.user.additionalDetails.profilePic}
              alt="User"
              className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 mb-3 shadow-sm hover:shadow-md transition duration-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-semibold text-white shadow-md mb-3 uppercase transition duration-300 hover:scale-105">
              {booking.user?.name?.charAt(0) || "U"}
            </div>
          )}

          <p className="text-lg font-semibold text-gray-800">{booking.user.name}</p>

          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <EnvelopeIcon className="w-5 h-5" />
            <p className="text-sm">{booking.user.email}</p>
          </div>
        </div>

        {/* Booking Info + Status */}
        <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-blue-900">
              Booking Details
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border px-3 py-2 rounded-md bg-white"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={updateStatus}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                Update
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${status === "confirmed"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              <p>
                Booked For: <strong>{booking.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-blue-600" />
              <p>
                Email: <strong>{booking.email}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <p>
                Check-In:{" "}
                <strong>{format(new Date(booking.checkIn), "dd MMM yyyy")}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <p>
                Check-Out:{" "}
                <strong>{format(new Date(booking.checkOut), "dd MMM yyyy")}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-blue-600">
                <UsersIcon className="w-5 h-5" />
                <span className="font-medium text-gray-700">
                  Guests: <strong>{booking.maxGuests}</strong>
                </span>
              </div>
              <div className="text-sm text-gray-500 ml-auto">
                Booked on:{" "}
                <span className="font-medium">
                  {booking.createdAt
                    ? format(new Date(booking.createdAt), "dd MMM yyyy, hh:mm a")
                    : "Unknown"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />
              <p>
                Total Price: <strong>₹{booking.totalPrice}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdminBooking;
