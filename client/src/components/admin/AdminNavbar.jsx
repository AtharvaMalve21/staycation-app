import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import { Link } from "react-router-dom";
import {
    BellIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { UserIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {

    const { user, setUser, setIsLoggedIn } = useContext(UserContext);
    const [showDropdown, setShowDropdown] = useState(false);


    const URI = import.meta.env.VITE_BACKEND_URI;

    const navigate = useNavigate();


    const handleLogout = async () => {
        try {

            const { data } = await axios.get(URI + "/api/auth/logout", { withCredentials: true });

            if (data.success) {
                setUser(null);
                setIsLoggedIn(false);
                toast.success(data.message);
                navigate("/login")
            }

        } catch (err) {
            toast.error(err.response?.data.message);
        }
    };

    return (
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white shadow-sm">
            {/* Left Logo */}
            <Link to="/" className="flex items-center space-x-3">
                <img src="/airbnb.png" alt="StayEase" className="w-8 h-8" />
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold text-gray-800">StayEase</h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Admin Info */}
                <div className="flex items-center gap-3 text-gray-600">
                    <span className="hidden md:block text-sm font-medium">
                        Hi! {user?.name || 'Admin'}
                    </span>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {user?.additionalDetails?.profilePic ? (
                                <img
                                    src={user.additionalDetails.profilePic}
                                    alt="profile"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium text-sm uppercase">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            )}
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <Link
                                    to="/admin/profile"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <UserIcon className="w-4 h-4" />
                                    My Profile
                                </Link>
                                <hr className="my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;