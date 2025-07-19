import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext.jsx";
import { ReviewsContext } from "../context/ReviewsContext.jsx";
import { LoaderContext } from "../context/LoaderContext.jsx";
import { ChevronLeft, ChevronRight, MapPin, Trash } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-hot-toast";
import BookingWidget from "../components/BookingWidget.jsx";
import StripeWrapper from "../components/StripeWrapper.jsx";

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
  const { isLoggedIn, user } = useContext(UserContext);
  const { reviews, setReviews } = useContext(ReviewsContext);
  const { setLoading } = useContext(LoaderContext);
  const [place, setPlace] = useState(null);
  const [body, setBody] = useState("");
  const [rating, setRating] = useState("");
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/places/${id}`);
      if (data.success) setPlace(data.data);
    } catch (err) {
      toast.error(err.response?.data.message || "Error fetching place details.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/reviews/${id}`, {
        withCredentials: true,
      });
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.log(err.response?.data.message || "Error fetching reviews.");
    } finally {
      setLoading(false);
    }
  };

  const createReview = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${URI}/api/reviews/${id}`,
        { body, rating },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data.success) {
        toast.success(data.message);
        setBody("");
        setRating("");
        await fetchReviews();
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Error creating review.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${URI}/api/reviews/${id}/${reviewId}`,
        { withCredentials: true }
      );
      if (data.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Error deleting review.");
    } finally {
      setLoading(false);
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
    return (
      <div className="text-center mt-10 text-gray-600 text-lg font-medium">
        Loading place details...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-10 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-2">
          <h1 className="text-3xl font-bold text-gray-900">{place.title}</h1>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-red-500" />
          {place.address}
        </div>

        {/* Image Slider */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Slider {...sliderSettings}>
            {place.photos?.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`photo-${i}`}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            ))}
          </Slider>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-4 border p-4 rounded-xl bg-gray-50 shadow-sm">
          {place.owner?.additionalDetails?.profilePic ? (
            <img
              src={place.owner.additionalDetails.profilePic}
              alt="Owner"
              className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow transition duration-300 hover:scale-105 hover:shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-semibold text-white shadow transition duration-300 hover:scale-105 hover:shadow-md uppercase">
              {place.owner?.name?.charAt(0) || "U"}
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-800">{place.owner.name}</p>
            <p className="text-sm text-gray-500">{place.owner.email}</p>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left content */}
          <div className="space-y-6 lg:col-span-2">
            <section>
              <h3 className="text-xl font-semibold mb-1">Description</h3>
              <p className="text-gray-700">{place.description}</p>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-1">Extra Info</h3>
              <p className="text-gray-700">{place.extraInfo}</p>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-1">Amenities</h3>
              {place.amenities.length > 0 ? (
                <ul className="list-disc list-inside grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {place.amenities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-500">No amenities listed</p>
              )}
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-1">Perks</h3>
              <ul className="list-disc list-inside">
                {place.perks.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-500">Check-in</p>
                <p className="font-medium">{place.checkIn}:00</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Check-out</p>
                <p className="font-medium">{place.checkOut}:00</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Max Guests</p>
                <p className="font-medium">{place.maxGuests}</p>
              </div>
            </div>

            <div className="pt-3 text-xl font-bold text-green-600">
              ₹{place.price}{" "}
              <span className="text-sm text-gray-500 font-medium">/night</span>
            </div>

            {/* Review Form */}
            {isLoggedIn ? (
              <div className="mt-8 border rounded-2xl p-6 bg-gray-50 shadow-md">
                <h2 className="text-xl font-bold mb-3 text-gray-800">Leave a Review</h2>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full p-3 border rounded-lg text-sm focus:ring focus:ring-indigo-500 resize-none"
                />
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="Rating (1–5)"
                    className="px-4 py-2 w-full sm:w-40 rounded-lg border focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    onClick={createReview}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-gray-600 italic">
                Please log in to leave a review.
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {isLoggedIn && (
              <div className="p-5 bg-white border rounded-2xl shadow-md">
                <BookingWidget
                  place={place}
                />
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="relative p-4 border rounded-xl bg-gray-50 shadow-sm">
                      <button
                        onClick={() => deleteReview(r._id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <p className="text-sm text-gray-700 mb-2">{r.body}</p>
                      <p className="text-yellow-500 text-sm">⭐ {r.rating}/5</p>
                      <div className="flex items-center gap-3 mt-3">
                        {r.createdBy?.additionalDetails?.profilePic ? (
                          <img
                            src={r.createdBy.additionalDetails.profilePic}
                            alt="Reviewer"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm transition duration-300 hover:scale-105 hover:shadow-md"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:shadow-lg uppercase">
                            {r.createdBy?.name?.charAt(0) || "U"}
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-gray-800">{r.createdBy.name}</p>
                          <p className="text-xs text-gray-500">{r.createdBy.additionalDetails?.email}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlace;
