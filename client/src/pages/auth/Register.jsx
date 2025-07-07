import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  EyeIcon,
  EnvelopeIcon,
  EyeSlashIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { LockClosedIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../../context/UserContext.jsx";
import { LoaderContext } from "../../context/LoaderContext.jsx";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const URI = import.meta.env.VITE_BACKEND_URI;

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (!gender || !role) {
      toast.error("Please select all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("phone", phone);
    formData.append("role", role);
    if (profilePhoto) {
      formData.append("profilePic", profilePhoto);
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${URI}/api/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.data);
        toast.success(data.message);
        navigate("/verify-account");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Registration failed";
      console.error("Registration Error:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 px-4 py-10">
      <form
        onSubmit={registerUser}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1e40af]">
          Create an Account
        </h1>

        {/* Profile Photo Upload */}
        <div className="flex justify-center mb-4">
          <label htmlFor="profilePhoto" className="cursor-pointer relative group">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-md"
              />
            ) : name ? (
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 text-3xl font-semibold shadow-md border-4 border-blue-100">
                {name[0].toUpperCase()}
              </div>
            ) : (
              <UserCircleIcon className="w-20 h-20 text-gray-400" />
            )}
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="absolute bottom-0 right-0 text-[10px] bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
              Edit
            </span>
          </label>
        </div>

        {/* Name + Email */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="relative mt-1">
              <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                id="name"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 border border-gray-300 rounded-md py-1.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          <div className="w-1/2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                id="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 border border-gray-300 rounded-md py-1.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm">
            <LockClosedIcon className="w-4 h-4 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-transparent text-sm placeholder:text-gray-400 outline-none"
            />
            <button type="button" onClick={togglePassword}>
              {showPassword ? (
                <EyeSlashIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
          <small className="text-xs text-gray-500 mt-1 block">
            8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
          </small>
        </div>

        {/* Gender + Phone */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="flex gap-2 mt-1 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
            </div>
          </div>
          <div className="w-1/2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-7 border border-gray-300 rounded-md py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-150"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>Select a role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already a user?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login now...
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
