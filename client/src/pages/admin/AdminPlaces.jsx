import React, { useContext, useEffect } from "react";
import { PlaceContext } from "../../context/PlaceContext.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminNav from "../../components/AdminNav.jsx";

import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const AdminPlaces = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { places, setPlaces } = useContext(PlaceContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchPlacesDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/places", {
        withCredentials: true,
      });
      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchPlacesDetails();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-pink-100 pb-12">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 mt-6 text-center">
          All Listed Accommodations
        </h1>

        {/* Add New Accommodation Button */}
        <div className="flex justify-center mb-8">
          <Link
            to="/admin/places/new"
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full shadow-md 
                     hover:bg-red-600 transition hover:scale-105 duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">Add New Accommodation</span>
          </Link>
        </div>

        {places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <Link
                to={`/admin/places/${place._id}`}
                key={place._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden border border-red-100"
              >
                <img
                  src={`${URI}/${place.photos[Math.floor(Math.random() * place.photos.length)]}`}
                  alt={place.title}
                  className="h-52 w-full object-cover rounded-t-2xl"
                />

                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-red-800 truncate">
                    {place.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {place.description}
                  </p>

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPinIcon className="w-5 h-5 text-red-500" />
                    <span className="truncate">{place.address}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={`${URI}/${place.owner.profilePic}`}
                      alt={place.owner.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {place.owner.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>{place.owner.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{place.owner.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-right">
                    <span className="text-xl font-semibold text-green-600">
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
