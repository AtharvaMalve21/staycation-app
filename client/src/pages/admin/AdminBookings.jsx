import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import { BookingContext } from "../../context/BookingContext.jsx";
import { LoaderContext } from "../../context/LoaderContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import AdminNav from "../../components/AdminNav.jsx";

const statusConfig = {
  pending: {
    bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: "🕐",
  },
  confirmed: {
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: "✅",
  },
  completed: {
    bg: "bg-gradient-to-r from-green-50 to-emerald-50",
    text: "text-green-800",
    border: "border-green-200",
    icon: "🎉",
  },
  cancelled: {
    bg: "bg-gradient-to-r from-red-50 to-rose-50",
    text: "text-red-800",
    border: "border-red-200",
    icon: "❌",
  },
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

  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return nights;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {user?.role === "admin" ? "Booking Management" : "Your Bookings"}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {user?.role === "admin"
              ? "Monitor and manage all customer bookings from your centralized dashboard"
              : "Track your reservations and upcoming stays"}
          </p>
          {bookingsToDisplay.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {bookingsToDisplay.length} {bookingsToDisplay.length === 1 ? 'Booking' : 'Bookings'} Found
              </span>
            </div>
          )}
        </div>

        {bookingsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-10">
            {bookingsToDisplay.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const nights = calculateNights(booking.checkIn, booking.checkOut);

              return (
                <Link
                  to={`/admin/bookings/${booking._id}`}
                  key={booking._id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200"
                >
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 z-10 px-3 py-2 rounded-full font-semibold text-sm shadow-lg backdrop-blur-sm ${status.bg} ${status.text} ${status.border} border-2`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{status.icon}</span>
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  {/* View Details Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <EyeIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>

                  {/* Property Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        booking.place.photos[0]
                          ? booking.place.photos[0]
                          : `${URI}/${booking.place.photos[0].replace("\\", "/")}`
                      }
                      alt="Property"
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {booking.place.title || booking.place.address}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{booking.place.address}</p>
                      </div>
                    </div>

                    {/* Guest Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      {booking.user?.additionalDetails?.profilePic ? (
                        <img
                          src={
                            typeof booking.user.additionalDetails.profilePic === "string"
                              ? booking.user.additionalDetails.profilePic
                              : booking.user.additionalDetails.profilePic?.url
                                ? booking.user.additionalDetails.profilePic.url
                                : `${URI}/${booking.user.additionalDetails.profilePic?.replace("\\", "/")}`
                          }
                          alt="Guest"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-md">
                          {booking.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <UserIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <p className="font-medium text-gray-900 truncate">{booking.user.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <p className="text-sm text-gray-600 truncate">{booking.user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <p className="text-xs font-medium text-blue-600 mb-2">BOOKING DETAILS</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm"><strong>Guest:</strong> {booking.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 truncate">{booking.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-amber-50 rounded-xl text-center">
                          <CalendarDaysIcon className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                          <p className="text-xs font-medium text-amber-600 mb-1">CHECK-IN</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(booking.checkIn).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl text-center">
                          <CalendarDaysIcon className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                          <p className="text-xs font-medium text-purple-600 mb-1">CHECK-OUT</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(booking.checkOut).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Duration & Guests */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {nights} {nights === 1 ? 'Night' : 'Nights'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-5 w-5 text-indigo-500" />
                          <span className="text-sm font-medium text-indigo-600">
                            {booking.maxGuests} {booking.maxGuests === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Amount</span>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
                          <span className="text-xl font-bold text-green-600">₹{booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-500 mb-6">
                {user?.role === "admin"
                  ? "No customer bookings are available at the moment."
                  : "You haven't made any bookings yet. Start exploring amazing places!"}
              </p>
              {user?.role !== "admin" && (
                <Link
                  to="/places"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <MapPinIcon className="h-5 w-5" />
                  Explore Places
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooking;