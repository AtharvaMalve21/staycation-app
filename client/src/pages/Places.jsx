import React, { useContext, useEffect } from "react";
import { PlaceContext } from "../context/PlaceContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { LoaderContext } from "../context/LoaderContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const Places = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { places, setPlaces } = useContext(PlaceContext);
  const { setLoading } = useContext(LoaderContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchPlacesDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(URI + "/api/places", {
        withCredentials: true,
      });

      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesDetails();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-10 px-6">
      {places.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <Link
              to={`/places/${place._id}`}
              key={place._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-2xl border border-gray-100"
            >
              <img
                src={place.photos?.[Math.floor(Math.random() * place.photos.length)] || "/placeholder.jpg"}
                alt={place.title}
                className="h-52 w-full object-cover rounded-t-2xl"
              />
              <div className="p-5 space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {place.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {place.description}
                </p>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                  <span className="truncate">{place.address}</span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {place.owner?.additionalDetails?.profilePic ? (
                    <img
                      src={place.owner.additionalDetails.profilePic}
                      alt={place.owner.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow transition duration-300 hover:scale-105 hover:shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center uppercase border border-gray-300 shadow transition duration-300 hover:scale-105 hover:shadow-md">
                      {place.owner?.name?.charAt(0) || "U"}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-800">{place.owner.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>{place.owner.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{place.owner.additionalDetails?.phone || "N/A"}</span>
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
  );
};

export default Places;
