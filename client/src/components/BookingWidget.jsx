import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

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

  const toggleContactFields = () => setShowContactFields((prev) => !prev);

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  const numberOfNights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      : 0;

  const totalAmount = numberOfNights > 0 ? numberOfNights * price * maxGuests : 0;

  const addBooking = async (e) => {
    e.preventDefault();

    if (numberOfNights <= 0) {
      return toast.error("Check-out must be after check-in.");
    }

    try {
      const { data } = await axios.post(
        URI + `/api/booking/${id}`,
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
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 w-full max-w-md ml-auto sticky top-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book This Stay</h2>

      <form onSubmit={addBooking} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Number of Guests</label>
          <input
            type="number"
            min="1"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Toggle Button */}
        <div>
          <button
            type="button"
            onClick={toggleContactFields}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md py-2 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
            </svg>

            {showContactFields ? "Hide Contact Information" : "Add Contact Information"}
          </button>
        </div>


        {/* Contact Fields */}
        {showContactFields && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )}

        {/* Total Price */}
        {numberOfNights > 0 && (
          <div className="text-right mt-2">
            <p className="text-sm text-gray-600">
              Total for <strong>{numberOfNights}</strong> nights:
            </p>
            <p className="text-xl font-bold text-green-600">₹{totalAmount}</p>
          </div>
        )}

        {/* Submit Button */}
        {showContactFields && (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Book Now
          </button>
        )}
      </form>
    </div>
  );
};

export default BookingWidget;
