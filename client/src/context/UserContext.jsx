import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userBooking,setUserBooking] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/users/profile", {
        withCredentials: true,
      });

      console.log(data);
      if (data.success) {
        setUser(data.data);
        setUserBooking(data.bookings);  
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, [isLoggedIn]);

  const value = {
    user,
    setUser,
    userBooking,
    isLoggedIn,
    setIsLoggedIn,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
// ✅ Default export to fix Vite warning
export default UserContextProvider;