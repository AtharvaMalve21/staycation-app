import React, { useState, useEffect, useContext } from 'react';
import AdminNav from '../../components/AdminNav';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { isLoggedIn } = useContext(UserContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/reviews`, {
        withCredentials: true,
      });
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.log(err.response?.data?.message || "Error fetching reviews");
    }
  };

  const deleteReview = async (id) => {
    try {
      const { data } = await axios.delete(`${URI}/api/reviews/delete/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        setReviews(reviews.filter((review) => review._id !== id));
        toast.success("Review deleted successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-pink-100 pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          All User Reviews
        </h2>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 transition transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Delete Icon */}
                <button
                  onClick={() => deleteReview(r._id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 z-10"
                >
                  <Trash className="w-5 h-5" />
                </button>

                {/* Place Image */}
                <img
                  src={`${URI}/${r.place.photos[Math.floor(Math.random() * r.place.photos.length)]}`}
                  alt={r.place.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />

                {/* Card Content */}
                <div className="p-5 space-y-4">
                  {/* Place Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 truncate">
                      {r.place.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {r.place.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      {r.place.address}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>₹{r.place.price} /night</span>
                      <span className="italic">{r.place.cancellationPolicy}</span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <p className="text-gray-800 text-sm font-medium">
                      “{r.body}”
                    </p>
                    <p className="text-yellow-500 text-sm font-semibold mt-1">
                      ⭐ {r.rating}/5
                    </p>
                  </div>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={`${URI}/${r.createdBy?.profilePic}`}
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {r.createdBy.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.createdBy.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-16 text-lg font-medium">
            No reviews available.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
