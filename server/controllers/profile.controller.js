const User = require("../models/user.model.js");
const Booking = require("../models/booking.model.js");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Profile = require("../models/profile.model.js");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found. Please log in again.",
      });
    }

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

    const user = await User.findById(userId).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    const { gender, phone } = req.body;
    const profilePic = req.file?.path;

    // Validate phone
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

    let cloudinaryResponse;
    if (profilePic) {
      cloudinaryResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "stay-cation/users",
      });

      // Delete local file after upload
      if (fs.existsSync(profilePic)) {
        fs.unlinkSync(profilePic);
      }
    }

    let updatedProfile;
    let isNewProfile = false;

    if (user.additionalDetails) {
      // Update existing profile
      const profile = await Profile.findById(user.additionalDetails._id);

      profile.gender = gender || profile.gender;
      profile.phone = phone || profile.phone;
      profile.profilePic = cloudinaryResponse?.secure_url || profile.profilePic;

      updatedProfile = await profile.save();
    } else {
      // Create new profile
      if (!gender || !phone) {
        return res.status(400).json({
          success: false,
          message: "Gender and phone are required to create a profile.",
        });
      }

      updatedProfile = await Profile.create({
        gender,
        phone,
        profilePic: cloudinaryResponse?.secure_url || "",
      });

      user.additionalDetails = updatedProfile._id;
      await user.save();

      isNewProfile = true;
    }

    // Fetch the latest user profile to return
    const fullUser = await User.findById(user._id)
      .populate("additionalDetails")
      .select("-password");

    return res.status(200).json({
      success: true,
      data: {
        user: fullUser,
        profile: updatedProfile,
      },
      message: isNewProfile
        ? "Profile created successfully."
        : "Profile updated successfully.",
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile. Please try again later.",
    });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    // Authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // Check if user has a profile
    const profileId = user.additionalDetails;
    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "User profile not found.",
      });
    }

    // Delete user profile
    await Profile.findByIdAndDelete(profileId);

    // Delete user's bookings
    await Booking.deleteMany({ user: userId });

    // Delete user's comments
    await Comment.deleteMany({ user: userId });

    // Delete the user account itself
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User profile and associated data deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting user profile:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
