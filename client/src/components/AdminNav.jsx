import React from "react";
import { NavLink } from "react-router-dom";
import {
  UserGroupIcon,
  HomeIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const links = [
  {
    to: "/admin/users",
    label: "Users",
    icon: <UserGroupIcon className="w-5 h-5" />,
  },
  {
    to: "/admin/places",
    label: "Places",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: <CalendarDaysIcon className="w-5 h-5" />,
  },
  {
    to: "/admin/reviews",
    label: "Reviews",
    icon: <StarIcon className="w-5 h-5" />,
  },
];

const AdminNav = () => {
  return (
    <div className="bg-red-50 border-b border-red-200">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-center gap-4 flex-wrap bg-white p-4 rounded-2xl shadow-lg">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-full transition text-sm font-medium border ${
                  isActive
                    ? "bg-red-600 text-white border-red-600 shadow-md"
                    : "bg-white text-red-700 border-red-300 hover:bg-red-100 hover:shadow"
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
