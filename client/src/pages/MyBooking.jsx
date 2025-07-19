import { useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { differenceInCalendarDays, format } from "date-fns";
import { BookingContext } from "../context/BookingContext";

const MyBooking = () => {
  const { bookings, setBookings } = useContext(BookingContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(URI + "/api/booking", {
          withCredentials: true,
        });
        if (data.success) {
          setBookings(data.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven't made any bookings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bookings.map((booking) => {
            const nights = differenceInCalendarDays(
              new Date(booking.checkOut),
              new Date(booking.checkIn)
            );

            return (
              <Link
                to={`/account/bookings/${booking._id}`}
                key={booking._id}
                className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white border border-gray-200 hover:border-indigo-300 flex flex-col"
              >
                {/* Image at the top */}
                <div className="w-full h-60 md:h-64 lg:h-72 overflow-hidden">
                  <img
                    src={booking.place.photos[0]}
                    alt={booking.place.title}
                    className="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
                  />
                </div>

                {/* Content below */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                      {booking.place.title}
                    </h3>

                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPinIcon className="h-4 w-4 mr-1 text-indigo-500" />
                      {booking.place.address}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <CalendarDaysIcon className="h-4 w-4 mr-1 text-blue-500" />
                      {format(new Date(booking.checkIn), "dd MMM yyyy")} →{" "}
                      {format(new Date(booking.checkOut), "dd MMM yyyy")}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <ClockIcon className="h-4 w-4 mr-1 text-yellow-500" />
                      {nights} {nights > 1 ? "nights" : "night"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm font-medium mt-2">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <UsersIcon className="h-5 w-5" />
                      <span>
                        {booking.maxGuests} Guest{booking.maxGuests > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1 justify-end text-green-600">
                        <CurrencyDollarIcon className="h-5 w-5" />
                        ₹{booking.totalPrice}
                      </div>
                      <div>
                        {booking.paymentStatus === "paid" ? (
                          <span className="text-xs font-semibold bg-green-500 text-white px-3 py-1 rounded-full shadow-sm">
                            Paid
                          </span>
                        ) : (
                          <span className="text-xs font-semibold bg-yellow-500 text-white px-3 py-1 rounded-full shadow-sm">
                            Unpaid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyBooking;
