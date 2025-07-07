import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { BookingContext } from "../context/BookingContext.jsx";
import { LoaderContext } from "../context/LoaderContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const MyBooking = () => {
  const { isLoggedIn, user } = useContext(UserContext);
  const { bookings, setBookings } = useContext(BookingContext);
  const { setLoading } = useContext(LoaderContext);
  const [adminBooking, setAdminBooking] = useState([]);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/booking`, {
        withCredentials: true,
      });
      if (data.success) setBookings(data.data);
    } catch (err) {
      console.log(err.response?.data.message || "Error fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingForAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/booking/admin`, {
        withCredentials: true,
      });
      if (data.success) setAdminBooking(data.data);
    } catch (err) {
      console.log(err.response?.data.message || "Error fetching admin bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookingDetails();
      if (user?.role === "admin") fetchBookingForAdmins();
    }
  }, [isLoggedIn]);

  const bookingsToDisplay = user?.role === "admin" ? adminBooking : bookings;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
          {user?.role === "admin" ? "All Bookings" : "Places You've Booked"}
        </h2>

        {bookingsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookingsToDisplay.map((booking) => (
              <Link
                to={`/account/bookings/${booking._id}`}
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 overflow-hidden"
              >
                <img
                  src={booking.place.photos[0]}
                  alt={booking.place.title}
                  className="w-full h-60 object-cover"
                />

                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <MapPinIcon className="h-5 w-5 text-red-500" />
                    {booking.place.address}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.user.profilePic}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                    <div className="text-sm">
                      <div className="flex items-center gap-1 font-medium text-gray-800">
                        <UserIcon className="h-4 w-4 text-blue-500" />
                        {booking.user.name}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <EnvelopeIcon className="h-4 w-4 text-green-500" />
                        {booking.user.email}
                      </div>
                    </div>
                  </div>

                  {/* Booking Person Info */}
                  <div>
                    <p className="text-sm text-gray-500">Booking For:</p>
                    <p className="font-medium text-gray-800">{booking.name}</p>
                    <p className="text-sm text-gray-600">{booking.email}</p>
                  </div>

                  {/* Date Info */}
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5 text-yellow-600" />
                      <span>
                        <strong>Check-In:</strong>{" "}
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5 text-yellow-600" />
                      <span>
                        <strong>Check-Out:</strong>{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Guests & Price */}
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <UsersIcon className="h-5 w-5" />
                      <span>{booking.maxGuests} Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CurrencyDollarIcon className="h-5 w-5" />
                      ₹{booking.totalPrice}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg text-gray-600 mt-20">
            No bookings found yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
