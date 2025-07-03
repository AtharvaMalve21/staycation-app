// ViewPlace.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext.jsx";
import { ReviewsContext } from "../context/ReviewsContext.jsx";
import { ChevronLeft, ChevronRight, MapPin, Pencil, Trash } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import BookingWidget from "../components/BookingWidget.jsx";

const CustomNextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition"
    onClick={onClick}
  >
    <ChevronRight className="w-6 h-6" />
  </button>
);

const CustomPrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-3 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition"
    onClick={onClick}
  >
    <ChevronLeft className="w-6 h-6" />
  </button>
);

const ViewPlace = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const { reviews, setReviews } = useContext(ReviewsContext);
  const [place, setPlace] = useState(null);
  const [body, setBody] = useState("");
  const [rating, setRating] = useState("");
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const fetchPlaceDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/places/${id}`);
      if (data.success) setPlace(data.data);
    } catch (err) {
      toast.error(err.response?.data.message || "Error fetching place details.");
      navigate("/login");
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/reviews/${id}`, { withCredentials: true });
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.log(err.response.data.message)
    }
  };

  const createReview = async () => {
    try {
      const { data } = await axios.post(`${URI}/api/reviews/${id}`, { body, rating }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      if (data.success) {
        setReviews([...reviews, data.data]);
        setBody("");
        setRating("");
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Error creating review.");
      navigate("/login");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const { data } = await axios.delete(`${URI}/api/reviews/${id}/${reviewId}`, {
        withCredentials: true,
      });
      if (data.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Error deleting review.");
    }
  };

  const deletePlace = async () => {
    try {
      const { data } = await axios.delete(`${URI}/api/places/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        navigate("/places");
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Error deleting place.");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchPlaceDetails();
  }, [isLoggedIn]);

  useEffect(() => {
    fetchReviews();
  }, [id]);

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

  if (!place) {
    return <div className="text-center mt-10 text-gray-600">Loading place details...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-90px)] py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-10">
        {/* Title & Actions */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{place.title}</h1>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/places/${place._id}/edit`)} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"><Pencil className="w-5 h-5" /></button>
            <button onClick={deletePlace} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"><Trash className="w-5 h-5" /></button>
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
                <img src={`${URI}/${photo}`} alt={`Slide ${idx + 1}`} className="w-full h-[400px] md:h-[500px] object-cover rounded-xl" />
              </div>
            ))}
          </Slider>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 shadow-sm">
          <img src={`${URI}/${place.owner.profilePic}`} alt="Owner" className="w-14 h-14 rounded-full object-cover border" />
          <div>
            <p className="text-lg font-semibold">{place.owner.name}</p>
            <p className="text-gray-500 text-sm">{place.owner.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6 text-gray-700">
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
              ) : <p className="text-sm italic text-gray-500">No amenities listed</p>}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Perks</h3>
              <ul className="list-disc list-inside">{place.perks.map((perk, i) => <li key={i}>{perk}</li>)}</ul>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div><p className="text-sm text-gray-500">Check-in</p><p className="font-semibold">{place.checkIn}:00</p></div>
              <div><p className="text-sm text-gray-500">Check-out</p><p className="font-semibold">{place.checkOut}:00</p></div>
              <div><p className="text-sm text-gray-500">Max Guests</p><p className="font-semibold">{place.maxGuests}</p></div>
            </div>

            <div className="pt-4 flex justify-end text-xl font-bold text-green-600">₹{place.price} <span className="text-sm text-gray-500 font-medium ml-1">/night</span></div>

            {/* Review Form */}
            {isLoggedIn ? (
              <div className="mt-10 border rounded-2xl p-6 bg-gray-50 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Leave a Review</h2>
                <textarea className="w-full border p-3 rounded-xl text-sm focus:ring focus:ring-blue-500" rows={4} placeholder="Your experience..." value={body} onChange={(e) => setBody(e.target.value)} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-4">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="Rating (1–5)"
                    className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm shadow-sm"
                  />
                  <button
                    onClick={createReview}
                    className="mt-3 sm:mt-0 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-md transition duration-200"
                  >
                    Submit Review
                  </button>
                </div>

              </div>
            ) : (
              <div className="mt-10 text-center text-gray-600">Please log in to leave a review.</div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="border rounded-2xl p-5 bg-white shadow-sm">
              <BookingWidget price={place?.price} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
              {reviews.length > 0 ? reviews.map((r) => (
                <div key={r._id} className="relative border bg-gray-50 rounded-xl p-4 shadow-sm">
                  <button onClick={() => deleteReview(r._id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button>
                  <p className="text-sm mb-2 mt-2">{r.body}</p>
                  <p className="text-yellow-500 text-sm">⭐ {r.rating}/5</p>
                  <div className="flex items-center gap-3 mt-3">
                    <img src={`${URI}/${r.createdBy?.profilePic}`} alt="Reviewer" className="w-10 h-10 rounded-full object-cover border" />
                    <div>
                      <p className="text-sm font-semibold">{r.createdBy.name}</p>
                      <p className="text-xs text-gray-500">{r.createdBy.email}</p>
                    </div>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlace;
