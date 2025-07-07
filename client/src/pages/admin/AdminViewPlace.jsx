import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import { ReviewsContext } from "../../context/ReviewsContext.jsx";
import { ChevronLeft, ChevronRight, MapPin, Pencil, Trash } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition"
    aria-label="Next Slide"
  >
    <ChevronRight className="w-6 h-6" />
  </button>
);

const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-3 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition"
    aria-label="Previous Slide"
  >
    <ChevronLeft className="w-6 h-6" />
  </button>
);

const AdminViewPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const { reviews, setReviews } = useContext(ReviewsContext);
  const [place, setPlace] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const URI = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoadingPlace(true);
        const { data } = await axios.get(`${URI}/api/places/${id}`);
        if (data.success) setPlace(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching place details.");
        navigate("/login");
      } finally {
        setLoadingPlace(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const { data } = await axios.get(`${URI}/api/reviews/${id}`, {
          withCredentials: true,
        });
        if (data.success) setReviews(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching reviews.");
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchPlaceDetails();
    fetchReviews();
  }, [id, isLoggedIn]);

  const deletePlace = async () => {
    try {
      const { data } = await axios.delete(`${URI}/api/places/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/admin/places");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting place.");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  if (loadingPlace) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        ⏳ Loading place details...
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        ⚠️ Place not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-90px)] py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-10">
        {/* Title & Actions */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{place.title}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/places/${place._id}/edit`)}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
              title="Edit Place"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={deletePlace}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
              title="Delete Place"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-5 h-5 text-red-500" />
          <p className="text-sm">{place.address}</p>
        </div>

        {/* Image Slider */}
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <Slider {...sliderSettings}>
            {place.photos?.map((photo, idx) => (
              <div key={idx}>
                <img
                  src={photo}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-xl"
                />
              </div>
            ))}
          </Slider>

        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 shadow-sm">
          <img
            src={
              place.owner?.profilePic
                ? place.owner.profilePic
                : "/default-avatar.png"
            }
            alt="Owner"
            className="w-14 h-14 rounded-full object-cover border"
          />

          <div>
            <p className="text-lg font-semibold">{place.owner?.name}</p>
            <p className="text-gray-500 text-sm">{place.owner?.email}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-gray-700">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800">Description</h3>
              <p>{place.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Extra Info</h3>
              <p>{place.extraInfo}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Amenities</h3>
              {place.amenities?.length > 0 ? (
                <ul className="list-disc list-inside grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {place.amenities.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-500">No amenities listed</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Perks</h3>
              {place.perks?.length > 0 ? (
                <ul className="list-disc list-inside">
                  {place.perks.map((perk, i) => <li key={i}>{perk}</li>)}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-500">No perks listed</p>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-semibold">{place.checkIn}:00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-semibold">{place.checkOut}:00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Guests</p>
                <p className="font-semibold">{place.maxGuests}</p>
              </div>
            </div>
            <div className="pt-4 text-right text-xl font-bold text-green-600">
              ₹{place.price}
              <span className="text-sm text-gray-500 font-medium ml-1">/night</span>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
            {loadingReviews ? (
              <p className="text-gray-500">🔄 Loading reviews...</p>
            ) : reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r._id} className="relative border bg-gray-50 rounded-xl p-4 shadow-sm">
                  <p className="text-sm mb-2 mt-2">“{r.body}”</p>
                  <p className="text-yellow-500 text-sm">⭐ {r.rating}/5</p>
                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src={
                        r.createdBy?.profilePic
                          ? r.createdBy.profilePic
                          : "/default-avatar.png"
                      }
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-sm font-semibold">{r.createdBy.name}</p>
                      <p className="text-xs text-gray-500">{r.createdBy.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewPlace;
