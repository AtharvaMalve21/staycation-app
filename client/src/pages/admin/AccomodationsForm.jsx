import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderContext } from "../../context/LoaderContext";

const perksList = [
  { label: "Wifi", icon: "📶", name: "wifi" },
  { label: "Free Parking", icon: "🄿️", name: "parking" },
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
  const [rules, setRules] = useState("");

  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();
  const { setLoading } = useContext(LoaderContext);

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
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl mt-10 space-y-10">
      <h2 className="text-3xl md:text-4xl font-bold text-red-700 text-center">
        Add New Accommodation
      </h2>

      <form onSubmit={addNewPlace} className="space-y-8">
        {/* Title */}
        <div>
          <label className="form-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="e.g., Cozy Apartment with View"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows={3}
            placeholder="Describe the property..."
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="form-label">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-input"
            placeholder="Full address of the accommodation"
            required
          />
        </div>

        {/* Photos Upload */}
        <div>
          <label className="form-label">Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="form-input cursor-pointer"
          />
          <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
            {previewPhotos.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="Preview"
                className="rounded-lg h-24 w-full object-cover shadow"
              />
            ))}
          </div>
        </div>

        {/* Perks */}
        <div>
          <label className="form-label">Perks</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {perksList.map((perk) => (
              <label
                key={perk.name}
                className={`border rounded-lg px-4 py-2 flex items-center gap-3 text-sm font-medium cursor-pointer transition-all duration-200 ${perks.includes(perk.name)
                  ? "bg-blue-100 border-blue-400 text-blue-700"
                  : "hover:bg-gray-100"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={perks.includes(perk.name)}
                  onChange={() => handlePerkToggle(perk.name)}
                  className="hidden"
                />
                <span className="text-xl">{perk.icon}</span>
                {perk.label}
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="form-label">Amenities</label>
          <input
            type="text"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            className="form-input"
            placeholder="e.g., Gym, Swimming Pool"
          />
        </div>

        {/* Extra Info */}
        <div>
          <label className="form-label">Extra Info</label>
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            className="form-textarea"
            rows={2}
            placeholder="Any additional info..."
          />
        </div>

        {/* Check-in/out + Guests */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Check-In</label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Check-Out</label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Max Guests</label>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Price + Rules */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Price (per night)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">House Rules</label>
            <input
              type="text"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="form-input"
              placeholder="e.g., No smoking"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow transition"
        >
          Save Accommodation
        </button>
      </form>
    </div>
  );

};

export default AccommodationsForm;
