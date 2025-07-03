const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUploader");

const { isAuthenticated } = require("../middleware/auth");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.get("/profile", isAuthenticated, getUserProfile);

router.put(
  "/update-profile",
  upload.single("profilePic"),
  isAuthenticated,
  updateUserProfile
);

module.exports = router;
