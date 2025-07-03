// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  UserGroupIcon,
  HomeIcon,
  CalendarDaysIcon,
  StarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { UserContext } from "../../context/UserContext";


const AdminDashboard = () => {
  const { isLoggedIn } = useContext(UserContext);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [stats, setStats] = useState({});
  const location = useLocation();

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/stats`, {
        withCredentials: true,
      });
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error(err.response?.data?.message || "Error fetching stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isLoggedIn]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-extrabold text-blue-600 border-b">
          AdminPanel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarLink to="/admin" label="Dashboard" icon={<ChartBarIcon className="w-5 h-5" />} current={location.pathname === "/admin"} />
          <SidebarLink to="/admin/users" label="Users" icon={<UserGroupIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/users")} />
          <SidebarLink to="/admin/places" label="Places" icon={<HomeIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/places")} />
          <SidebarLink to="/admin/bookings" label="Bookings" icon={<CalendarDaysIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/bookings")} />
          <SidebarLink to="/admin/reviews" label="Reviews" icon={<StarIcon className="w-5 h-5" />} current={location.pathname.includes("/admin/reviews")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 bg-gray-50 p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />}
            label="Users"
            value={stats?.totalUsers}
          />
          <DashboardCard
            icon={<HomeIcon className="w-6 h-6 text-purple-600" />}
            label="Places"
            value={stats?.totalPlaces}
          />
          <DashboardCard
            icon={<CalendarDaysIcon className="w-6 h-6 text-green-600" />}
            label="Bookings"
            value={stats?.totalBookings}
          />
          <DashboardCard
            icon={<StarIcon className="w-6 h-6 text-yellow-500" />}
            label="Reviews"
            value={stats?.totalReviews}
          />
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
    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition ${
      current
        ? "bg-blue-100 text-blue-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
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
