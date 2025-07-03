import { createContext, useState } from "react";

export const BookingContext = createContext({});

export const BookingContextProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  return (
    <BookingContext.Provider value={{ bookings, setBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
