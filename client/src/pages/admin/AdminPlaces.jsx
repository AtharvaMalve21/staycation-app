import React, { useContext, useEffect, useState } from "react";
import { PlaceContext } from "../../context/PlaceContext.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const AdminPlaces = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { places, setPlaces } = useContext(PlaceContext);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPlacesDetails = async () => {
    try {
      setLoading(true);
      const query = filterType ? `?type=${filterType}` : "";
      const { data } = await axios.get(`${URI}/api/places/filter${query}`, {
        withCredentials: true,
      });

      console.log(data);

      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.error(err.response?.data.message || "Error fetching places.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesDetails();
  }, [isLoggedIn, filterType]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center sm:text-left">
            Accommodation Management Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-rose-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Cottage">Cottage</option>
              <option value="Room">Room</option>
              <option value="Other">Other</option>
            </select>

            <Link
              to="/admin/places/new"
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-md shadow hover:bg-rose-600 transition transform hover:scale-105 duration-150"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add New Accommodation</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <Link
                to={`/admin/places/${place._id}`}
                key={place._id}
                className="relative bg-white border border-rose-100 rounded-xl overflow-hidden shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                {/* Type Badge */}
                {place.type && (
                  <span className="absolute top-2 left-2 bg-rose-100 text-rose-600 text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
                    {place.type}
                  </span>
                )}

                <img
                  src={
                    place.photos?.length > 0
                      ? place.photos[Math.floor(Math.random() * place.photos.length)]
                      : "/placeholder.jpg"
                  }
                  alt={place.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-rose-700 truncate">
                    {place.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {place.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPinIcon className="w-5 h-5 text-rose-500" />
                    <span className="truncate">{place.address}</span>
                  </div>

                  <div className="pt-3 text-right">
                    <span className="text-lg font-bold text-green-600">
                      ₹{place.price}
                    </span>
                    <span className="text-sm text-gray-500"> /night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-20 text-lg font-medium">
            No places found. Please check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlaces;
