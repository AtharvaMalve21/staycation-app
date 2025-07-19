const express = require("express");
const router = express.Router();

const {
  addNewBooking,
  markBookingPaid,
  getBooking,
  getBookingsForAdmin,
  viewBooking,
  editBooking,
  cancelBooking,
} = require("../controllers/booking.controller.js");

const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/auth.middleware.js");

// 📌 CREATE a new booking (User)
router.post("/:id", isAuthenticated, addNewBooking);

router.put("/:id/pay", isAuthenticated, markBookingPaid);

// 📌 GET all bookings for logged-in user
router.get("/", isAuthenticated, getBooking);

// 📌 GET all bookings (Admin only)
router.get("/admin", isAuthenticated, isAuthorized, getBookingsForAdmin);

// 📌 GET single booking by ID (User/Admin)
router.get("/:id", isAuthenticated, viewBooking);

// 📌 UPDATE a booking by ID
router.put("/:id", isAuthenticated, editBooking);

// 📌 DELETE a booking by ID
router.delete("/cancel/:id", isAuthenticated, cancelBooking);

module.exports = router;
