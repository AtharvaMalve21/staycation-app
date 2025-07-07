import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  UserGroupIcon,
  HomeIcon,
  CalendarDaysIcon,
  StarIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { UserContext } from "../../context/UserContext";
import { LoaderContext } from "../../context/LoaderContext";
import ActivityFeed from "../../components/ActivityFeed";

const AdminDashboard = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [stats, setStats] = useState({});
  const [bookingTrends, setBookingTrends] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
      fetchBookingTrends();
    }
  }, [isLoggedIn]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/admin/stats`, {
        withCredentials: true,
      });
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingTrends = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/booking-trends`, {
        withCredentials: true,
      });
      if (data.success) {
        setBookingTrends(data.data);
      }
    } catch (err) {
      console.error("Error fetching trends:", err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="text-xl font-bold text-blue-600">AdminPanel</div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white md:w-64 w-full md:flex flex-col border-r shadow-md fixed md:static z-50 top-16 md:top-0 h-screen md:h-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-6 text-2xl font-extrabold text-blue-600 border-b hidden md:block">
          AdminPanel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarLink to="/admin/dashboard" label="Dashboard" icon={<ChartBarIcon className="w-5 h-5" />} current={location.pathname === "/admin/dashboard"} />
          <SidebarLink to="/admin/users" label="Users" icon={<UserGroupIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/users")} />
          <SidebarLink to="/admin/places" label="Places" icon={<HomeIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/places")} />
          <SidebarLink to="/admin/bookings" label="Bookings" icon={<CalendarDaysIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/bookings")} />
          <SidebarLink to="/admin/reviews" label="Reviews" icon={<StarIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/reviews")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-32 flex-1 p-5 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />} label="Users" value={stats?.totalUsers} />
          <DashboardCard icon={<HomeIcon className="w-6 h-6 text-purple-600" />} label="Places" value={stats?.totalPlaces} />
          <DashboardCard icon={<CalendarDaysIcon className="w-6 h-6 text-green-600" />} label="Bookings" value={stats?.totalBookings} />
          <DashboardCard icon={<StarIcon className="w-6 h-6 text-yellow-500" />} label="Reviews" value={stats?.totalReviews} />
        </div>

        {/* Trends & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Trends</h2>
            {bookingTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">No booking data yet.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

// Sidebar Link Component
const SidebarLink = ({ to, label, icon, current }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition ${current ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      }`}
  >
    {icon}
    {label}
  </Link>
);

// Card Component
const DashboardCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value ?? "—"}</h3>
      </div>
    </div>
  </div>
);
