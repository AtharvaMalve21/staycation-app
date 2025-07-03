// src/routes/AuthRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx"

const AuthRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(UserContext);

  if (isLoggedIn) {
    // Redirect based on role
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRoute;
