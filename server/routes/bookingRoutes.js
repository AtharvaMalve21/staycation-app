const express = require("express");
const router = express.Router();

const {
  addNewBooking,
  getBooking,
  getBookingsForAdmin,
  viewBooking,
  editBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post("/:id", isAuthenticated, addNewBooking);
router.get("/", isAuthenticated, getBooking);
router.get("/admin", isAuthenticated, isAuthorized, getBookingsForAdmin);
router.get("/:id", isAuthenticated, viewBooking);
router.put("/:id", isAuthenticated, editBooking);
router.delete("/:id", isAuthenticated, deleteBooking);

module.exports = router;
