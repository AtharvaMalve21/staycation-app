const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  getAllPlaces,
  viewPlace,
  getAllBookings,
  verifyPlace,
  getStats,
  filterUserByGender,
  searchUser,
  changeUserRole,
  getUserReviews,
  getRecentActivities,
  getBookingTrends,
  updateBookingStatus,
} = require("../controllers/admin.controller.js");

const { isAuthenticated, isAuthorized } = require("../middleware/auth.middleware.js");

router.get("/users", isAuthenticated, isAuthorized, getAllUsers);
router.delete("/users/:id", isAuthenticated, isAuthorized, deleteUser);
router.get(
  "/recent-activities",
  isAuthenticated,
  isAuthorized,
  getRecentActivities
);
router.get("/booking-trends", isAuthenticated, isAuthorized, getBookingTrends);
router.get("/places", isAuthenticated, isAuthorized, getAllPlaces);
router.get("/reviews", isAuthenticated, isAuthorized, getUserReviews);
router.get("/admin/places/:id", isAuthenticated, isAuthorized, viewPlace);
router.get("/bookings", isAuthenticated, isAuthorized, getAllBookings);
router.put("/verify-place/:id", isAuthenticated, isAuthorized, verifyPlace);
router.put(
  "/bookings/:id/status",
  isAuthenticated,
  isAuthorized,
  updateBookingStatus
);
router.get("/stats", isAuthenticated, isAuthorized, getStats);
router.get("/users/:filter", isAuthenticated, isAuthorized, filterUserByGender);
router.get("/:search", isAuthenticated, isAuthorized, searchUser);
router.patch("/users/:id/role", isAuthenticated, isAuthorized, changeUserRole);

module.exports = router;
