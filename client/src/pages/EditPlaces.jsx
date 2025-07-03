import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { PlaceContext } from "../context/PlaceContext";

const perksList = [
  { label: "Wifi", icon: "📶", name: "wifi" },
  { label: "Free Parking Spot", icon: "🅿️", name: "parking" },
  { label: "TV", icon: "📺", name: "tv" },
  { label: "Radio", icon: "📻", name: "radio" },
  { label: "Pets Allowed", icon: "🐶", name: "pets" },
  { label: "Private Entrance", icon: "🚪", name: "entrance" },
];

const EditPlaces = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [loading, setLoading] = useState(true);

  const { places, setPlaces } = useContext(PlaceContext);

  const [tourType, setTourType] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const { data } = await axios.get(`${URI}/api/places/${id}`, {
          withCredentials: true,
        });
        const place = data.data;

        console.log(data);

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
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch place data");
        navigate("/account/places");
      }
    };
    fetchPlace();
  }, [id]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviewPhotos(files.map((file) => URL.createObjectURL(file)));
  };

  const handlePerkToggle = (perk) => {
    setPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
    );
  };

  const updatePlace = async (ev) => {
    ev.preventDefault();

    try {
      const formData = new FormData();
      formData.append("tourType", tourType);
      formData.append("additionalDetails", additionalDetails);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("existingPhotos", JSON.stringify(existingPhotos)); // Keep existing photos
      photos.forEach((photo) => formData.append("photos", photo)); // Append new photos
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
    }
  };

  if (loading)
    return <div className="text-center mt-8 text-lg">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Edit Your Listing</h2>

      <form onSubmit={updatePlace} className="space-y-6">
        {/* Title */}
        <div>
          <label className="font-medium text-lg">Title</label>
          <input
            type="text"
            className="w-full border p-3 mt-1 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title for your place"
          />
        </div>

        {/* Address */}
        <div>
          <label className="font-medium text-lg">Address</label>
          <input
            type="text"
            className="w-full border p-3 mt-1 rounded-lg"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address of your place"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-medium text-lg">Description</label>
          <textarea
            className="w-full border p-3 mt-1 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your place..."
          />
        </div>

        {/* Tour Type */}
        <div>
          <label className="font-medium text-lg">Tour Type</label>
          <input
            type="text"
            className="w-full border p-3 mt-1 rounded-lg"
            value={tourType}
            onChange={(e) => setTourType(e.target.value)}
            placeholder="e.g., Adventure, Beach, Hill station"
          />
        </div>

        {/* Additional Details */}
        <div>
          <label className="font-medium text-lg">Additional Details</label>
          <input
            type="text"
            className="w-full border p-3 mt-1 rounded-lg"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
          />
        </div>

        {/* Perks */}
        <div>
          <label className="font-medium text-lg block mb-2">Perks</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {perksList.map((perk) => (
              <label
                key={perk.name}
                className={`flex items-center gap-2 border p-3 rounded-lg cursor-pointer ${
                  perks.includes(perk.name) ? "bg-blue-100 border-blue-400" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={perks.includes(perk.name)}
                  onChange={() => handlePerkToggle(perk.name)}
                />
                <span>
                  {perk.icon} {perk.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="font-medium text-lg">Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full mt-2"
            onChange={handlePhotoUpload}
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {existingPhotos.map((src, idx) => (
              <img
                key={idx}
                src={`${URI}/${src}`}
                alt={`Existing ${idx}`}
                className="h-24 w-full object-cover rounded-md border"
              />
            ))}
            {previewPhotos.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded-md border"
              />
            ))}
          </div>
        </div>

        {/* Extra Info */}
        <div>
          <label className="font-medium text-lg">Extra Info</label>
          <textarea
            className="w-full border p-3 mt-1 rounded-lg"
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            placeholder="Rules, special notes, etc."
          />
        </div>

        {/* Check-in / Check-out / Max Guests / Price */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label>Check-In</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <label>Check-Out</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <label>Max Guests</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <label>Price (per night)</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all text-lg font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPlaces;
