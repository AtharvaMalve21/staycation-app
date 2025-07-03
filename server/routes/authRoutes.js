const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUploader");

const {
  register,
  login,
  logout,
  verifyAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { isAuthenticated } = require("../middleware/auth");


//Register User
router.post("/register", upload.single("profilePic"), register);

//Login User
router.post("/login", login);

//Logout User
router.get("/logout", isAuthenticated, logout);

//Verify Account
router.post("/verify-account", verifyAccount);

//Forgot Password
router.post("/forgot-password", forgotPassword);

//Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
