const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUploader");

const {
  addPlace,
  getAllPlaces,
  filterPlaces,
  viewPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/place.controller.js");

const { isAuthenticated, isAuthorized } = require("../middleware/auth.middleware.js");

// Admin-only: Create a new place
router.post(
  "/add",
  upload.array("photos", 100),
  isAuthenticated,
  isAuthorized,
  addPlace
);

// Public: Get all places (with pagination)
router.get("/", getAllPlaces);

// Public: Filter by type (e.g., /places/filter?type=hotel)
router.get("/filter", filterPlaces);

// Public: View a specific place by ID
router.get("/:id", viewPlace);

// Admin-only: Update a place
router.put(
  "/:id",
  upload.array("photos", 100),
  isAuthenticated,
  isAuthorized,
  updatePlace
);

// Admin-only: Delete a place
router.delete("/:id", isAuthenticated, isAuthorized, deletePlace);

module.exports = router;
