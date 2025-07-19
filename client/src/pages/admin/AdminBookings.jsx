import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import { BookingContext } from "../../context/BookingContext.jsx";
import { LoaderContext } from "../../context/LoaderContext.jsx"; // ✅ loader
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
import AdminNav from "../../components/AdminNav.jsx";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminBooking = () => {
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
      console.log(err.response?.data.message);
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
      console.log(err.response?.data.message);
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
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-pink-100 pb-12">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-10 tracking-tight">
          {user?.role === "admin" ? "Manage All Customer Bookings" : "Your Booking Summary"}
        </h2>

        {bookingsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookingsToDisplay.map((booking) => (
              <Link
                to={`/admin/bookings/${booking._id}`}
                key={booking._id}
                className="relative bg-white rounded-2xl shadow hover:shadow-lg transform hover:-translate-y-1 transition duration-300 overflow-hidden border border-red-100"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${statusColors[booking.status] || "bg-gray-100 text-gray-800"
                    }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>

                <img
                  src={
                    booking.place.photos[0] // Cloudinary style
                      ? booking.place.photos[0]
                      : `${URI}/${booking.place.photos[0].replace("\\", "/")}` // fallback for local path
                  }
                  alt="Place"
                  className="w-full h-60 object-cover rounded-t-2xl"
                />


                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <MapPinIcon className="h-5 w-5 text-red-500" />
                    {booking.place.address}
                  </div>

                  <div className="flex items-center gap-3">
                    {booking.user?.additionalDetails?.profilePic ? (
                      <img
                        src={
                          typeof booking.user.additionalDetails.profilePic === "string"
                            ? booking.user.additionalDetails.profilePic
                            : booking.user.additionalDetails.profilePic?.url
                              ? booking.user.additionalDetails.profilePic.url
                              : `${URI}/${booking.user.additionalDetails.profilePic?.replace("\\", "/")}`
                        }
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium text-base shadow-md uppercase">
                        {booking.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}


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

                  <div className="text-sm">
                    <p className="text-gray-500">Booking For:</p>
                    <p className="font-medium text-gray-800">{booking.name}</p>
                    <p className="text-gray-600">{booking.email}</p>
                  </div>

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

export default AdminBooking;
