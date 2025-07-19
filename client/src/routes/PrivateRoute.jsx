// routes/PrivateRoute.jsx
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { toast } from "react-hot-toast";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isLoggedIn } = useContext(UserContext);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false); // NEW

  useEffect(() => {
    if (typeof isLoggedIn === "undefined" || typeof user === "undefined") return;

    if (!isLoggedIn || !user) {
      setRedirectPath("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === "admin") {
        toast.error("Admins can't access this page");
        setRedirectPath("/admin/dashboard");
      } else {
        toast.error("Only admins can access this page");
        setRedirectPath("/");
      }
    }

    setCheckedAuth(true);
  }, [isLoggedIn, user, allowedRoles]);

  if (!checkedAuth) {
    // Optionally, show loading spinner
    return <div className="text-center py-10">Checking authorization...</div>;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
