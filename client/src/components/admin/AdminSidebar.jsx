import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  HomeIcon,
  CalendarDaysIcon,
  StarIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const SidebarLink = ({ to, label, icon, current }) => (
  <Link
    to={to}
    className={`flex items-center py-3 px-4 gap-3 text-base transition-all duration-200 ${current
        ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-600 font-medium"
        : "hover:bg-gray-100/90 border-white text-gray-700 hover:text-indigo-600"
      }`}
  >
    <div className={`${current ? 'text-indigo-600' : 'text-gray-500'}`}>
      {icon}
    </div>
    <span className="md:block hidden">{label}</span>
  </Link>
);

const AdminSidebar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <ChartBarIcon className="w-6 h-6" />
    },
    {
      name: "Places",
      path: "/admin/places",
      icon: <HomeIcon className="w-6 h-6" />
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: <CalendarDaysIcon className="w-6 h-6" />
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: <StarIcon className="w-6 h-6" />
    },
  ];

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200"
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white md:w-64 w-16 border-r border-gray-200 h-screen flex flex-col transition-all duration-300 fixed md:static z-50 top-16 md:top-0 ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Sidebar Header - Only show on desktop */}
        <div className="p-6 border-b border-gray-200 hidden md:block">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 flex flex-col">
          {sidebarLinks.map((item, index) => (
            <SidebarLink
              key={index}
              to={item.path}
              label={item.name}
              icon={item.icon}
              current={
                item.path === "/admin/dashboard"
                  ? location.pathname === item.path
                  : location.pathname.includes(item.path.split('/').pop())
              }
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;