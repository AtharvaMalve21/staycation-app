// routes/PrivateRoute.jsx
import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { toast } from "react-hot-toast";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isLoggedIn } = useContext(UserContext);
  const location = useLocation();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      toast.error("Admins can't access this page");
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      toast.error("Only admins can access this page");
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
