import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const perksList = [
  { label: "Wifi", icon: "📶", name: "wifi" },
  { label: "Free Parking", icon: "🅿️", name: "parking" },
  { label: "TV", icon: "📺", name: "tv" },
  { label: "Radio", icon: "📻", name: "radio" },
  { label: "Pets Allowed", icon: "🐶", name: "pets" },
  { label: "Private Entrance", icon: "🚪", name: "entrance" },
];

const AccommodationsForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [amenities, setAmenities] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [price, setPrice] = useState("");
  const [rules,setRules] = useState("");

  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

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

  const addNewPlace = async (ev) => {
    ev.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      photos.forEach((photo) => formData.append("photos", photo));
      formData.append("perks", JSON.stringify(perks));
      formData.append("amenities", amenities);
      formData.append("extraInfo", extraInfo);
      formData.append("rules", rules);
      formData.append("checkIn", checkIn);
      formData.append("checkOut", checkOut);
      formData.append("maxGuests", maxGuests);
      formData.append("price", price);

      const { data } = await axios.post(`${URI}/api/places/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/places");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Failed to add place");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg mt-10 space-y-10">
      <h2 className="text-3xl font-bold text-red-700 text-center">
        Add New Accommodation
      </h2>

      <form onSubmit={addNewPlace} className="space-y-8">
        {/* --- Section: Basic Info --- */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700">Title</label>
            <input
              type="text"
              placeholder="e.g. Beachfront Villa"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Description</label>
            <textarea
              rows="3"
              placeholder="Write about the place..."
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Address</label>
            <input
              type="text"
              placeholder="123 Main St, City"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* --- Section: Photos --- */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Upload Photos</label>
          <input type="file" multiple onChange={handlePhotoUpload} className="hidden" id="upload" />
          <label
            htmlFor="upload"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
          >
            Upload Photos
          </label>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {previewPhotos.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} className="h-24 w-full rounded-md object-cover" />
            ))}
          </div>
        </div>

        {/* --- Section: Perks --- */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Select Perks</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {perksList.map((perk) => (
              <label
                key={perk.name}
                className={`flex items-center gap-2 border px-4 py-2 rounded-md cursor-pointer ${perks.includes(perk.name)
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={perks.includes(perk.name)}
                  onChange={() => handlePerkToggle(perk.name)}
                />
                <span>{perk.icon}</span>
                {perk.label}
              </label>
            ))}
          </div>
        </div>

        {/* --- Section: Amenities, Rules --- */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700">Amenities</label>
            <textarea
              rows="2"
              placeholder="List of amenities"
              className="form-textarea"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Extra Info </label>
            <input
              type="text"
              placeholder="e.g. Perfect for weekend getaways or romantic retreats."
              className="form-input"
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Rules</label>
            <input
              type="text"
              placeholder="e.g. No loud music after 10 PM"
              className="form-input"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
            />
          </div>
        </div>

        {/* --- Section: Timing & Capacity --- */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-700">Check-In</label>
            <input
              type="number"
              min="0"
              max="23"
              placeholder="e.g. 12"
              className="form-input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Check-Out</label>
            <input
              type="number"
              min="0"
              max="23"
              placeholder="e.g. 14"
              className="form-input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-700">Max Guests</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 4"
              className="form-input"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Price (₹/night)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 1200"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all text-lg font-semibold"
        >
          + Add Accommodation
        </button>
      </form>
    </div>
  );
};

export default AccommodationsForm;
