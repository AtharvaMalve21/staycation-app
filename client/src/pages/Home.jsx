import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-6 md:px-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center">Book Your Dream Stay</h1>
        <p className="text-lg md:text-xl text-center mt-4">
          Find the perfect place to relax, recharge, or work remotely — anywhere in the world.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/places" className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition">Explore Stays</Link>
          <Link to="/register" className="border border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">Get Started</Link>
        </div>
      </div>

      {/* Featured Places Section */}
      <section className="py-16 px-6 md:px-20 bg-blue-50">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Featured Destinations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {places.map((place) => (
            <Link
              to={`/places/${place._id}`}
              key={place._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={`${URI}/${place.photos[Math.floor(Math.random() * place.photos.length)]}`}
                alt={place.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">{place.title}</h2>
                <p className="text-gray-600 text-sm">{place.description}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                  <span>{place.address}</span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={`${URI}/${place.owner?.profilePic}`}
                    alt={place.owner?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{place.owner?.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <EnvelopeIcon className="w-4 h-4" />
                      {place.owner?.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <PhoneIcon className="w-4 h-4" />
                      {place.owner?.phone}
                    </div>
                  </div>
                </div>
                <div className="pt-4 text-right">
                  <span className="text-xl font-semibold text-green-600">₹{place.price}</span>
                  <span className="text-sm text-gray-500"> /night</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-20 bg-white text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Want to list your place?</h2>
        <p className="text-gray-600 mt-2">Earn money by hosting travelers on your own terms.</p>
        <Link
          to="/account/places/new"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Become a Host
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} Bookify — All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
