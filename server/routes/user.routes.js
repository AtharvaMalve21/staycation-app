const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUploader");

const { isAuthenticated } = require("../middleware/auth.middleware.js");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/profile.controller.js");

router.get("/profile", isAuthenticated, getUserProfile);

router.put(
  "/update-profile",
  upload.single("profilePic"),
  isAuthenticated,
  updateUserProfile
);

router.delete("/delete-profile", isAuthenticated, deleteUserProfile);

module.exports = router;
