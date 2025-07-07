import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderContext } from "../context/LoaderContext.jsx";
import axios from "axios";
import {toast} from "react-hot-toast";

const EditPlaces = () => {
  const { id } = useParams();
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();
  const { setLoading } = useContext(LoaderContext);

  const [tourType, setTourType] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(0);

  // Fetch place data
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${URI}/api/places/${id}`, {
          withCredentials: true,
        });

        const place = data.data;
        setTourType(place.tourType);
        setAdditionalDetails(place.additionalDetails);
        setTitle(place.title);
        setDescription(place.description);
        setAddress(place.address);
        setExistingPhotos(place.photos || []);
        setPerks(place.perks || []);
        setExtraInfo(place.extraInfo);
        setCheckIn(place.checkIn);
        setCheckOut(place.checkOut);
        setMaxGuests(place.maxGuests);
        setPrice(place.price);
      } catch (err) {
        toast.error("Failed to fetch place data.");
        navigate("/account/places");
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const updatePlace = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("tourType", tourType);
      formData.append("additionalDetails", additionalDetails);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("existingPhotos", JSON.stringify(existingPhotos));
      photos.forEach((photo) => formData.append("photos", photo));
      formData.append("perks", JSON.stringify(perks));
      formData.append("extraInfo", extraInfo);
      formData.append("checkIn", checkIn);
      formData.append("checkOut", checkOut);
      formData.append("maxGuests", maxGuests);
      formData.append("price", price);

      const { data } = await axios.put(`${URI}/api/places/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/account/places");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    setPhotos([...e.target.files]);
  };

  if (!title) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Accommodation</h2>

      <form onSubmit={updatePlace} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-600 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            rows="3"
          ></textarea>
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-600 font-medium">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        {/* Existing Photos */}
        <div>
          <label className="block text-gray-600 font-medium">Current Photos</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {existingPhotos.map((photo, i) => (
              <img
                key={i}
                src={`${URI}/${photo}`}
                alt="Existing"
                className="w-28 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Upload New Photos */}
        <div>
          <label className="block text-gray-600 font-medium">Upload New Photos</label>
          <input
            type="file"
            multiple
            onChange={handlePhotoUpload}
            className="mt-2"
          />
        </div>

        {/* Check-in, Check-out, Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-600 font-medium">Check-In</label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Check-Out</label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Max Guests</label>
            <input
              type="number"
              min="1"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-600 font-medium">Price (₹)</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Update Accommodation
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlaces;
