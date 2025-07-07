const User = require("../models/userModel");

const Booking = require("../models/bookingModel");

const Review = require("../models/reviewModel");

const fs = require("fs");

const cloudinary = require("cloudinary").v2;

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found. Please log in again.",
      });
    }

    //future scope

    const bookings = await Booking.find({ user: userId });

    return res.status(200).json({
      success: true,
      data: user,
      bookings,
      message: "User profile retrieved successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile. Please try again later.",
      error: err.message,
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    const { name, email, gender, phone } = req.body;

    // ✅ Validate phone number
    if (phone && phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

    // ✅ Prevent email change
    if (email && email !== user.email) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be changed directly. Please contact support.",
      });
    }

    // ✅ Handle profile picture upload (Cloudinary)
    if (req.file?.path) {
      // 🔥 Delete old image from Cloudinary if exists
      if (user.profilePic?.public_id) {
        try {
          await cloudinary.uploader.destroy(user.profilePic.public_id);
        } catch (err) {
          console.warn("Failed to delete old Cloudinary image:", err.message);
        }
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "stay-cation",
      });

      // 🔍 Safety check
      if (!result.secure_url || !result.public_id) {
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed. Please try again.",
        });
      }

      // 🧹 Delete local file
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.warn("Temp file deletion failed:", error.message);
      }

      // ✅ Update profilePic with Cloudinary data
      user.profilePic = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // ✅ Update other fields
    user.name = name || user.name;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;

    // 📥 Save updated user
    await user.save();

    // 🔒 Return safe user data
    const safeUserData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      profilePic: user.profilePic,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Your profile has been updated successfully.",
      data: safeUserData,
    });
  } catch (err) {
    console.error("🔥 Profile update error:", err); // 🔍 log full error
    return res.status(500).json({
      success: false,
      message: "Failed to update profile. Please try again later.",
      error: err.message,
    });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User found.",
      });
    }

    // 1. Delete profile picture from Cloudinary if exists
    if (user.profilePic?.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // 2. Delete user
    await user.deleteOne();

    // 3. Delete all bookings by user
    await Booking.deleteMany({ user: userId });

    // 4. Delete all reviews by user
    await Review.deleteMany({ createdBy: userId });

    return res.status(200).json({
      success: true,
      message: "User profile and related data deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting profile",
      error: err.message,
    });
  }
};
