import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import ConfirmModel from "../../components/ConfirmModel.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import AdminNav from "../../components/AdminNav.jsx";

import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";

const AdminUsers = () => {
  const { isLoggedIn } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const URI = import.meta.env.VITE_BACKEND_URI;
  const genders = ["Male", "Female"];

  useEffect(() => {
    fetchUsers();
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedGender) {
      fetchUsersByGender(selectedGender);
    }
  }, [selectedGender]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/users`, {
        withCredentials: true,
      });
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err.response?.data?.message || "Error fetching users");
    }
  };

  const fetchUsersByGender = async (gender) => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/users/filter`, {
        params: { query: gender },
        withCredentials: true,
      });
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err.response?.data?.message || "Error filtering users");
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const { data } = await axios.patch(
        `${URI}/api/admin/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const triggerDelete = (userId) => {
    setUserToDelete(userId);
    setConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const { data } = await axios.delete(
        `${URI}/api/admin/users/${userToDelete}`,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Top Horizontal Admin Navigation */}
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b pb-2">
          Admin – User Management
        </h1>

        <SearchBar setUsers={setUsers} users={users} />

        {/* Gender Filter */}
        <div className="mb-10 flex flex-wrap items-center gap-4">
          {genders.map((gender) => (
            <button
              key={gender}
              onClick={() => setSelectedGender(gender)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium shadow transition-all duration-200 ${
                selectedGender === gender
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-blue-100"
              }`}
            >
              {gender}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedGender("");
              fetchUsers();
            }}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition"
          >
            Clear Filter
          </button>
        </div>

        {/* User Grid */}
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={
                      user.profilePic
                        ? `${URI}/${user.profilePic}`
                        : "/default-avatar.png"
                    }
                    alt={user.name}
                    className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {user.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Gender:</span>{" "}
                    {user.gender || "Not specified"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleRoleToggle(user._id, user.role)}
                    className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <>
                        <ShieldCheckIcon className="w-4 h-4" />
                        Revoke Admin
                      </>
                    ) : (
                      <>
                        <ShieldExclamationIcon className="w-4 h-4" />
                        Make Admin
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => triggerDelete(user._id)}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                    title="Delete User"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                <div className="mt-4 text-sm flex items-center gap-2">
                  {user.isAccountVerified ? (
                    <span className="flex items-center text-green-600 font-medium">
                      <CheckCircleIcon className="w-5 h-5 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-400 font-medium">
                      <XCircleIcon className="w-5 h-5 mr-1" />
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-8">No users found.</p>
        )}

        {/* Global Confirmation Modal */}
        <ConfirmModel
          isOpen={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmDeleteUser}
          message="Are you sure you want to permanently delete this user?"
        />
      </main>
    </div>
  );
};

export default AdminUsers;
