import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  UserGroupIcon,
  HomeIcon,
  CalendarDaysIcon,
  StarIcon,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />} 
          label="Total Users" 
          value={stats?.totalUsers}
          bgColor="bg-blue-50"
        />
        <DashboardCard 
          icon={<HomeIcon className="w-6 h-6 text-purple-600" />} 
          label="Total Places" 
          value={stats?.totalPlaces}
          bgColor="bg-purple-50"
        />
        <DashboardCard 
          icon={<CalendarDaysIcon className="w-6 h-6 text-green-600" />} 
          label="Total Bookings" 
          value={stats?.totalBookings}
          bgColor="bg-green-50"
        />
        <DashboardCard 
          icon={<StarIcon className="w-6 h-6 text-yellow-500" />} 
          label="Total Reviews" 
          value={stats?.totalReviews}
          bgColor="bg-yellow-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Trends</h2>
          {bookingTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No booking data available yet.</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

// Enhanced Dashboard Card Component
const DashboardCard = ({ icon, label, value, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${bgColor}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">
          {value?.toLocaleString() ?? "—"}
        </h3>
      </div>
    </div>
  </div>
);

export default AdminDashboard;