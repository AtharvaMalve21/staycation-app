const User = require("../models/userModel");

const Booking = require("../models/bookingModel");

const Review = require("../models/reviewModel");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "-password -verificationCode -resetPasswordCode"
    );
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
    // Authenticated user ID from token
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    const { name, email, gender, phone } = req.body;
    const profilePic = req.file?.path;

    // Optional: Validate phone number
    if (phone && phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

    // Optional: Prevent changing email without verification
    if (email && email !== user.email) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be changed directly. Please contact support.",
      });
    }

    // Update user fields
    user.name = name || user.name;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

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

    // Delete user
    await user.deleteOne();

    // Delete all bookings by the user
    await Booking.deleteMany({ user: userId });

    // Delete all reviews by the user
    await Review.deleteMany({ createdBy: userId });

    return res.status(200).json({
      success: true,
      message: "User profile and related data deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
