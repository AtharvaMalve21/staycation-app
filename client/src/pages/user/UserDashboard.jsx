import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  CalendarDaysIcon,
  HomeModernIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { BookingContext } from "../../context/BookingContext";

const UserDashboard = () => {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useContext(UserContext);
  const { bookings, setBookings } = useContext(BookingContext);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const upcomingBookings = [
    {
      id: 1,
      place: "Seaside Villa",
      date: "2025-07-20",
      location: "Goa",
      price: 2500,
      status: "Confirmed",
    },
    {
      id: 2,
      place: "Mountain Retreat",
      date: "2025-08-05",
      location: "Manali",
      price: 3200,
      status: "Pending",
    },
  ];

  const fetchBookingDetails = async () => {
    try {

      const { data } = await axios.get(`${URI}/api/booking`, { withCredentials: true });

      console.log(data);
      if (data.success) {
        setBookings(data.data);
        console.log(data.message);
      }

    } catch (err) {
      console.log(err)
    }
  }

  const logoutUserAccount = async () => {
    try {
      const { data } = await axios.get(URI + "/api/auth/logout", {
        withCredentials: true,
      });

      if (data.success) {
        setUser(null);
        setIsLoggedIn(false);
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Logout failed");
    }
  };


  useEffect(() => {
    fetchBookingDetails();
  }, [isLoggedIn])

  return (
    <div className="min-h-[calc(100vh-90px)] bg-blue-50 px-4 md:px-10 py-12 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Welcome Section */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user?.name} 👋
          </h2>
          <p className="text-gray-600">Plan your next stay with ease.</p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
            {/* Explore Stays */}
            <Link
              to="/places"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-center"
            >
              Explore Stays
            </Link>

            {/* My Bookings */}
            <Link
              to="/account/bookings"
              className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2 rounded-lg hover:bg-indigo-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                />
              </svg>
              <span>My Bookings</span>
            </Link>
          </div>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* ... keep as is */}
        </div>

        {/* Profile Overview */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.profilePic ? `${URI}/${user.profilePic}` : "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
          />
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold">{user?.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4" /> {user?.email}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> {user?.phone}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/account/profile"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg>
              <span>View Profile</span>
            </Link>
            <button
              onClick={logoutUserAccount}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">📅 Your Bookings</h2>

          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3">Place</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-medium">{booking.place.title}</td>
                      <td className="px-4 py-2">{booking.place.address}</td>
                      <td className="px-4 py-2">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-green-600 font-semibold">₹{booking.totalPrice}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3">Place</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcomingBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-medium">{booking.place}</td>
                      <td className="px-4 py-2">{booking.location}</td>
                      <td className="px-4 py-2">{booking.date}</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">₹{booking.price}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
