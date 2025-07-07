import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { LoaderContext } from "../context/LoaderContext.jsx"; // ✅ Import global context

const BookingWidget = ({ price }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showContactFields, setShowContactFields] = useState(false);

  const { id } = useParams();
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const { setLoading } = useContext(LoaderContext); // ✅ Access global loader

  const toggleContactFields = () => setShowContactFields((prev) => !prev);

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  const numberOfNights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      : 0;

  const totalAmount =
    numberOfNights > 0 ? numberOfNights * price * maxGuests : 0;

  const addBooking = async (e) => {
    e.preventDefault();

    if (numberOfNights <= 0) {
      return toast.error("Check-out must be after check-in.");
    }

    try {
      setLoading(true); // ✅ Start global loader
      const { data } = await axios.post(
        `${URI}/api/booking/${id}`,
        { checkIn, checkOut, maxGuests, name, email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/account/bookings");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Booking failed");
      navigate("/login");
    } finally {
      setLoading(false); // ✅ Stop global loader
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 w-full max-w-md ml-auto sticky top-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book This Stay</h2>

      <form onSubmit={addBooking} className="space-y-5">
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="text-sm font-medium text-gray-700">Number of Guests</label>
          <input
            type="number"
            min="1"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500"
          />
        </div>

        {/* Toggle Contact Info */}
        <button
          type="button"
          onClick={toggleContactFields}
          className="w-full text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md py-2 transition"
        >
          {showContactFields ? "Hide Contact Information" : "Add Contact Information"}
        </button>

        {/* Contact Fields */}
        {showContactFields && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Price */}
        {numberOfNights > 0 && (
          <div className="text-right mt-2">
            <p className="text-sm text-gray-600">
              Total for <strong>{numberOfNights}</strong> nights:
            </p>
            <p className="text-xl font-bold text-green-600">₹{totalAmount}</p>
          </div>
        )}

        {/* Submit */}
        {showContactFields && (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Book Now
          </button>
        )}
      </form>
    </div>
  );
};

export default BookingWidget;
