import React, { useState, useContext } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { LoaderContext } from "../context/LoaderContext"; // <-- Import LoaderContext
import { toast } from "react-hot-toast";

const BookingWidget = ({ place }) => {
  const { user } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext); // <-- Use setLoading
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const today = format(new Date(), "yyyy-MM-dd");
  const URI = import.meta.env.VITE_BACKEND_URI;

  const numberOfNights =
    checkIn && checkOut
      ? differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
      : 0;

  const totalPrice =
    numberOfNights && guests ? numberOfNights * place.price * guests : 0;

  const handleBookNow = async () => {
    if (!user) {
      toast.error("Please log in to book.");
      return;
    }

    if (!checkIn || !checkOut || !name || !email) {
      toast.error("Please fill in all booking details.");
      return;
    }

    try {
      setLoading(true); // Start loader

      const { data } = await axios.post(
        `${URI}/api/booking/${place._id}`,
        {
          place: place._id,
          checkIn,
          checkOut,
          guests,
          name,
          email,
          totalPrice,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/account/bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 sticky top-20 border">
      <h2 className="text-2xl font-semibold mb-4 text-center">Book This Stay</h2>

      <div className="text-lg font-medium text-center mb-2">
        ₹{place.price}
        <span className="text-gray-500 text-sm"> per night</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || today}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Guests</label>
        <input
          type="number"
          min={1}
          max={place.maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {numberOfNights > 0 && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div className="mb-4 text-center text-lg font-semibold">
            Total: ₹{totalPrice}
          </div>
        </>
      )}

      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        onClick={handleBookNow}
      >
        Book Now
      </button>
    </div>
  );
};

export default BookingWidget;
