import React, { useContext, useEffect } from "react";
import NavPlace from "../components/NavPlace";
import { PlaceContext } from "../context/PlaceContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { LoaderContext } from "../context/LoaderContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const MyAccommodations = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { places, setPlaces } = useContext(PlaceContext);
  const { setLoading } = useContext(LoaderContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchPlacesDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/places`, {
        withCredentials: true,
      });
      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message || "Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesDetails();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavPlace />

      {/* Add New Accommodation Button */}
      <div className="flex justify-center mt-10 mb-6">
        <Link
          to="/account/places/new"
          className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full shadow-md 
                     hover:bg-red-600 transition hover:scale-105 duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium">Add New Accommodation</span>
        </Link>
      </div>

      {/* Accommodation Grid */}
      {places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
          {places.map((place) => (
            <Link
              to={`/places/${place._id}`}
              key={place._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <img
                src={
                  place.photos?.length > 0
                    ? place.photos[Math.floor(Math.random() * place.photos.length)]
                    : "/placeholder.jpg"
                }
                alt={place.title}
                className="h-56 w-full object-cover"
              />


              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                  {place.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {place.description}
                </p>

                <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                  <span className="truncate">{place.address}</span>
                </div>

                {/* Owner Info */}
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={place.owner?.profilePic || "/default-avatar.png"}
                    alt={place.owner?.name || "Owner"}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {place.owner.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <EnvelopeIcon className="w-4 h-4" />
                      {place.owner.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <PhoneIcon className="w-4 h-4" />
                      {place.owner.phone}
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                <div className="pt-4 flex justify-end items-end">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{place.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/night</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No accommodations added yet.
        </div>
      )}
    </div>
  );
};

export default MyAccommodations;
