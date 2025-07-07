import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import { LoaderContext } from "../context/LoaderContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState("");

  console.log(user);

  // Set initial preview image once user data is available
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setGender(user.gender || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");

      // ✅ Update here: if profilePic is a string (local path)
      if (typeof user.profilePic === "string") {
        setPreview(`${URI}/${user.profilePic.replace("\\", "/")}`);
      } else if (user.profilePic?.url) {
        setPreview(user.profilePic.url);
      }
    }
  }, [user]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!gender) {
      return toast.error("Please select your gender.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("phone", phone);
    if (profilePhoto) {
      formData.append("profilePic", profilePhoto);
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`${URI}/api/users/update-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.data);
        toast.success(data.message);
        navigate("/account/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 px-4 py-12">
      <form onSubmit={updateProfile} className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Edit Profile</h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <label htmlFor="profilePic" className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-md"
              />
            ) : (
              <UserCircleIcon className="w-20 h-20 text-gray-400" />
            )}
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-not-allowed"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">Gender</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
              />
              Male
            </label>
            <label className="flex items-center gap-2">
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

        {/* Phone */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
