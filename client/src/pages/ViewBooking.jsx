import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
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
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const ViewBooking = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [booking, setBooking] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const fetchBookingDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/booking/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        setBooking(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  const deleteBooking = async () => {
    try {

      const {data} = await axios.delete(`${URI}/api/booking/${id}`,{withCredentials:true});

      if(data.success) {
        toast.success(data.message);
        navigate("/account/bookings");
      }

    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  useEffect(() => {
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
        ? (prev - 1 + booking.place.photos.length) %
        booking.place.photos.length
        : 0
    );
  };

  if (!booking) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 font-sans">
      {/* Image slider */}
      <div className="relative w-full h-[420px] overflow-hidden rounded-3xl shadow-lg">
        {booking.place.photos.map((photo, index) => (
          <img
            key={index}
            src={`${URI}/${photo}`}
            alt=""
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
          {booking.place.photos.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Place Details */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 flex justify-between items-center">
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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative">
        {/* Edit + Delete */}
        <div className="absolute right-0 top-0 flex gap-3 pr-2">
          <button
            onClick={() => navigate(`/account/bookings/${booking._id}/edit`)}
            className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-full text-sm transition"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={deleteBooking}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm transition"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>

        {/* Owner Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
          <img
            src={`${URI}/${booking.user.profilePic}`}
            alt="Owner"
            className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 mb-3"
          />
          <p className="text-lg font-semibold">{booking.user.name}</p>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <EnvelopeIcon className="w-5 h-5" />
            <p>{booking.user.email}</p>
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
                    ? format(
                      new Date(booking.createdAt),
                      "dd MMM yyyy, hh:mm a"
                    )
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

export default ViewBooking;
