import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import VerifyAccount from "./pages/auth/VerifyAccount.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Home from "./pages/Home.jsx";
import AuthRoute from "./routes/AuthRoute.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import MyProfile from "./pages/MyProfile.jsx"
import { UserContext } from "./context/UserContext.jsx";
import { Navigate } from "react-router-dom";
import Places from "./pages/Places.jsx";
import ViewPlace from "./pages/ViewPlace.jsx";
import MyBooking from "./pages/MyBooking.jsx";
import ViewBooking from "./pages/ViewBooking.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx"
import AdminPlaces from "./pages/admin/AdminPlaces.jsx";
import AdminBooking from "./pages/admin/AdminBookings.jsx";
import AdminViewPlace from "./pages/admin/AdminViewPlace.jsx";
import AddPlace from "./pages/admin/AddPlace.jsx";
import AdminReviews from "./pages/admin/AdminReviews.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ViewAdminBooking from "./pages/admin/ViewAdminBooking.jsx";

const App = () => {

  const { user } = useContext(UserContext)

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Home />
            )
          }
        />

        <Route
          path="/places"
          element={
            user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Places />
            )
          }
        />

        <Route
          path="/places/:id"
          element={
            user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <ViewPlace />
            )
          }
        />

        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } />
        <Route path="/verify-account" element={
          <AuthRoute>
            <VerifyAccount />
          </AuthRoute>
        } />
        <Route path="/forgot-password" element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        } />
        <Route path="/reset-password" element={
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        } />

        <Route path="/user/dashboard" element={
          <PrivateRoute allowedRoles={["user"]}>
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/dashboard" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="/account/profile" element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <MyProfile />
          </PrivateRoute>
        } />

        <Route path="/account/profile/edit" element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <EditProfile />
          </PrivateRoute>
        } />

        <Route path="/places/booking/:id" element={
          <PrivateRoute allowedRoles={["user"]}>
            <UserDashboard />
          </PrivateRoute>
        } />



        <Route path="/account/bookings" element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <MyBooking />
          </PrivateRoute>
        } />

        <Route path="/account/bookings/:id" element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <ViewBooking />
          </PrivateRoute>
        } />

        <Route path="/admin/profile" element={
          <PrivateRoute allowedRoles={["admin"]} >
            <MyProfile />
          </PrivateRoute>
        } />

        <Route path="/admin/users" element={
          <PrivateRoute allowedRoles={["admin"]} >
            <AdminUsers />
          </PrivateRoute>
        } />

        <Route path="/admin/places" element={
          <PrivateRoute allowedRoles={["admin"]} >
            <AdminPlaces />
          </PrivateRoute>
        } />

        <Route path="/admin/places/:id" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminViewPlace />
          </PrivateRoute>
        } />

        <Route path="/admin/bookings" element={
          <PrivateRoute allowedRoles={["admin"]} >
            <AdminBooking />
          </PrivateRoute>
        } />

        <Route path="/admin/bookings/:id" element={
          <PrivateRoute allowedRoles={["admin"]} >
            <ViewAdminBooking />
          </PrivateRoute>
        } />

        <Route path="/admin/reviews" element={
          <PrivateRoute allowedRoles={["admin"]} >
            <AdminReviews />
          </PrivateRoute>
        } />

        <Route path="/admin/places/new" element={
          <PrivateRoute allowedRoles={["admin"]} >
            <AddPlace />
          </PrivateRoute>
        } />

      </Route>
    </Routes>
  );
};

export default App;
