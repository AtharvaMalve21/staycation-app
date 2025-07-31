import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { LoaderContext } from "../context/LoaderContext.jsx";
import { UsersIcon } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const ViewBooking = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [booking, setBooking] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${URI}/api/booking/${id}`, {
          withCredentials: true,
        });
        if (data.success) {
          setBooking(data.data);
        }
      } catch (err) {
        console.log(err.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [isLoggedIn]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      booking.place.photos ? (prev + 1) % booking.place.photos.length : 0
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      booking.place.photos
        ? (prev - 1 + booking.place.photos.length) % booking.place.photos.length
        : 0
    );
  };

  if (!booking)
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Booking details loading...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 font-sans">
      {/* Image Slider */}
      <div className="relative w-full h-[420px] overflow-hidden rounded-3xl shadow-lg">
        {booking.place.photos.map((photo, index) => (
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
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {booking.place.title}
        </h2>
        <p className="text-gray-600">{booking.place.description}</p>
        <div className="flex items-center gap-2 text-gray-500">
          <MapPinIcon className="w-5 h-5 text-blue-600" />
          <p>{booking.place.address}</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {booking.place.perks.map((perk, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {perk}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {booking.place.amenities.map((perk, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Booking Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative">
        {/* Owner Info */}
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


        {/* Booking Info */}
        <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow space-y-4">
          <h3 className="text-2xl font-semibold text-blue-900 mb-3">
            Booking Information
          </h3>
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
                <strong>
                  {new Date(booking.checkIn).toLocaleDateString()}
                </strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <p>
                Check-Out:{" "}
                <strong>
                  {new Date(booking.checkOut).toLocaleDateString()}
                </strong>
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

          {/* Conditional Payment Button */}
          <div className="mt-8 flex justify-end">
            {booking.paymentStatus === "paid" ? (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 rounded-xl font-semibold shadow-sm">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Payment Completed</span>
              </div>
            ) : (
              <button
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 active:scale-95"
                onClick={() => {
                  navigate(`/payment/${booking._id}`);
                }}
                aria-label="Proceed to payment"
              >
                <div className="flex items-center justify-center w-6 h-6 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Pay Securely Online</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewBooking;
