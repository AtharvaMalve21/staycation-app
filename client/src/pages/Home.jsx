import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { MapPinIcon } from '@heroicons/react/24/outline';
import { LoaderContext } from '../context/LoaderContext.jsx';

const Home = () => {
  const [places, setPlaces] = useState([]);
  const { setLoading } = useContext(LoaderContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchPlacesDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/places`);
      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.error(err.message || "Error fetching places");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesDetails();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white py-24 px-6 md:px-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-sm">
          Book Your Dream Stay
        </h1>
        <p className="text-lg md:text-xl text-center mt-4 max-w-2xl mx-auto">
          Find the perfect place to relax, recharge, or work remotely — anywhere in the world.
        </p>
        <div className="mt-10 flex justify-center gap-6 flex-wrap">
          <Link
            to="/places"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-100 transition duration-200"
          >
            Explore Stays
          </Link>
          <Link
            to="/register"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Featured Places Section */}
      <section className="py-20 px-6 md:px-20 bg-blue-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center md:text-left">
          Featured Destinations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <Link
              to={`/places/${place._id}`}
              key={place._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden duration-300"
            >
              <img
                src={
                  place.photos?.length > 0
                    ? place.photos[Math.floor(Math.random() * place.photos.length)]
                    : "/placeholder.jpg"
                }
                alt={place.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">{place.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{place.description}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                  <span>{place.address}</span>
                </div>
                <div className="pt-3 text-right">
                  <span className="text-xl font-semibold text-green-600">₹{place.price}</span>
                  <span className="text-sm text-gray-500"> /night</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 bg-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Want to list your place?
        </h2>
        <p className="text-gray-600 mt-3 text-sm md:text-base">
          Earn money by hosting travelers on your own terms.
        </p>
        <Link
          to="/user/dashboard"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-md transition"
        >
          Become a Host
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} Bookify — All rights reserved.</p>
      </footer>
    </div>
  );

};

export default Home;
