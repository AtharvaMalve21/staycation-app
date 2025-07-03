import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const EditBooking = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    maxGuests: "",
  });

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchBookingDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/booking/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        setBooking(data.data);
      }
    } catch (err) {
      console.error(err.response?.data.message);
    }
  };

  const editBooking = async (ev) => {
    ev.preventDefault();
    try {
      const { data } = await axios.put(`${URI}/api/booking/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (data.success) {
        setBooking(data.data);
        toast.success(data.message);
        navigate("/account/bookings");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [isLoggedIn]);

  useEffect(() => {
    if (booking) {
      setFormData({
        name: booking.name,
        email: booking.email,
        checkIn: booking.checkIn.split("T")[0],
        checkOut: booking.checkOut.split("T")[0],
        maxGuests: booking.maxGuests,
      });
    }
  }, [booking]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      booking.placeId.photos ? (prev + 1) % booking.placeId.photos.length : 0
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      booking.placeId.photos
        ? (prev - 1 + booking.placeId.photos.length) %
          booking.placeId.photos.length
        : 0
    );
  };

  if (!booking) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 font-sans">
      {/* Image slider */}
      <div className="relative w-full h-[420px] overflow-hidden rounded-3xl shadow-lg">
        {booking.placeId.photos.map((photo, index) => (
          <img
            key={index}
            src={`${URI}/${photo}`}
            alt=""
            className={`absolute w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
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
          {booking.placeId.photos.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Place Details */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {booking.placeId.title}
        </h2>
        <p className="text-gray-600">{booking.placeId.description}</p>
        <div className="flex items-center gap-2 text-gray-500">
          <MapPinIcon className="w-5 h-5 text-blue-600" />
          <p>{booking.placeId.address}</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {booking.placeId.perks.map((perk, i) => (
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
        {/* Owner Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
          <img
            src={`${URI}/${booking.owner.profilePic}`}
            alt="Owner"
            className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 mb-3"
          />
          <p className="text-lg font-semibold">{booking.owner.name}</p>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <EnvelopeIcon className="w-5 h-5" />
            <p>{booking.owner.email}</p>
          </div>
        </div>

        {/* Booking Info Form */}
        <form
          onSubmit={editBooking}
          className="bg-white rounded-2xl p-6 shadow-md space-y-4 col-span-2"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Edit Booking
          </h3>

          <div className="space-y-1">
            <label htmlFor="name" className="block text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="checkIn" className="block text-gray-600">
                Check-In
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="checkOut" className="block text-gray-600">
                Check-Out
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="maxGuests" className="block text-gray-600">
              Max Guests
            </label>
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBooking;
