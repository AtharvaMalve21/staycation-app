const Booking = require("../models/bookingModel");
const Place = require("../models/placesModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

// Utility function for role check
const isAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user && user.role === "admin";
};

// ===========================
// User Management
// ===========================

exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!(await isAdmin(userId))) {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this route.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //find the user
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with the provided ID.",
      });
    }

    await user.deleteOne();

    //delete the bookings if exists
    const bookings = await Booking.deleteMany({ user: userId });

    //delete the reviews
    const reviews = await Review.deleteMany({ createdBy: userId });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterUserByGender = async (req, res) => {
  try {
    const { query } = req.query;

    const users = await User.find({ gender: query });

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter a name to search for users.",
      });
    }

    // Perform case-insensitive partial search using regex
    const users = await User.find({
      name: { $regex: query.trim(), $options: "i" },
    });

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No users found matching "${query.trim()}".`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Found ${users.length} user(s) matching "${query.trim()}".`,
      data: users,
    });
  } catch (err) {
    console.error("Search error:", err.message);
    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while searching for users. Please try again later.",
    });
  }
};

// ===========================
// Place Management
// ===========================

exports.getAllPlaces = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!(await isAdmin(userId))) {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this route.",
      });
    }

    const places = await Place.find({}).populate("owner");

    return res.status(200).json({
      success: true,
      data: places,
      message: "Places fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.viewPlace = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    if (!user || user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "No User found.",
      });
    }

    //find the place
    const { id: placeId } = req.params;
    const place = await Place.findById(placeId).populate("owner");
    if (!place) {
      return res.status(400).json({
        success: false,
        message: "No Place found with the provided id.",
      });
    }

    return res.status(200).json({
      success: true,
      data: place,
      message: "Place found.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyPlace = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!(await isAdmin(userId))) {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this route.",
      });
    }

    const { id: placeId } = req.params;
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    if (place.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Place is already verified.",
      });
    }

    place.isVerified = true;
    await place.save();

    return res.status(200).json({
      success: true,
      message: "Place verified successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// Booking Management
// ===========================

exports.getAllBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!(await isAdmin(userId))) {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this route.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({})
      .skip(skip)
      .limit(limit)
      .populate("user place");

    return res.status(200).json({
      success: true,
      data: bookings,
      message: "Bookings fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }

    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    const data = {
      totalUsers: totalUsers,
      totalPlaces: totalPlaces,
      totalBookings: totalBookings,
      totalReviews: totalReviews,
    };

    return res.status(200).json({
      success: true,
      data: data,
      message: "Stats data fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Review Moderation

exports.getUserReviews = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "No User found.",
      });
    }

    const reviews = await Review.find({}).populate("createdBy place");
    return res.status(200).json({
      success: true,
      data: reviews,
      message: "Reviews data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// User Role Management
// ===========================

exports.changeUserRole = async (req, res) => {
  try {
    //find the user
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with the provided ID.",
      });
    }

    const { role } = req.body;
    // Validate role input
    if (!role || typeof role !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid role to assign to the user.",
      });
    }

    // Avoid setting the same role
    if (user.role === role) {
      return res.status(400).json({
        success: false,
        message: `The user already has the role "${role}".`,
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
      message: `User role updated successfully to "${role}".`,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    return res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while updating the user role. Please try again later.",
    });
  }
};
