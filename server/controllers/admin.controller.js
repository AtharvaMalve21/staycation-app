const Booking = require("../models/booking.model.js");
const Place = require("../models/place.model.js");
const User = require("../models/user.model.js");
const Review = require("../models/review.model.js");
const cloudinary = require("cloudinary").v2;
const Profile = require("../models/profile.model.js");
const fs = require("fs");

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

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .select("-password")
      .populate("additionalDetails");

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
    }).select("-password");

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

    const places = await Place.find({}).populate({
      path: "owner",
      populate: {
        path: "additionalDetails",
      },
    });

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
    const place = await Place.find({}).populate({
      path: "owner",
      populate: {
        path: "additionalDetails",
      },
    });
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
      .populate({
        path: "user",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("place");

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

exports.getRecentActivities = async (req, res) => {
  try {
    // Fetch recent entries
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("additionalDetails");

    const recentPlaces = await Place.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "owner",
        populate: { path: "additionalDetails" },
      });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "user",
        populate: { path: "additionalDetails" },
      })
      .populate("place");

    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "createdBy",
        populate: { path: "additionalDetails" },
      })
      .populate("place");

    const activities = [];

    // User registrations
    recentUsers.forEach((user) =>
      activities.push({
        type: "user",
        message: `${user.name || "Unknown"} registered`,
        date: user.createdAt,
      })
    );

    // New places
    recentPlaces.forEach((place) =>
      activities.push({
        type: "place",
        message: `${place.owner.name || "Unknown"} added a new place: ${
          place.title
        }`,
        date: place.createdAt,
      })
    );

    // Bookings
    recentBookings.forEach((booking) =>
      activities.push({
        type: "booking",
        message: `${booking.user.name || "Unknown"} made a booking`,
        date: booking.createdAt,
      })
    );

    // Reviews
    recentReviews.forEach((review) =>
      activities.push({
        type: "review",
        message: `${review.createdBy.name || "Unknown"} reviewed ${
          review.place?.name || "a place"
        }`,
        date: review.createdAt,
      })
    );

    // Sort and send top 10
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      message: "Recent activity fetched",
      data: activities.slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBookingTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Get today's date and go back 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 5);

    const bookingStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Generate list of last 6 months
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const trends = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(endDate.getMonth() - (5 - i));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const stat = bookingStats.find(
        (b) => b._id.month === month && b._id.year === year
      );

      trends.push({
        month: `${monthNames[month - 1]}`,
        bookings: stat ? stat.count : 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking trends fetched successfully",
      data: trends,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching booking trends",
      error: error.message,
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { id: bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide a status.",
      });
    }

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      data: booking,
      message: "Booking status updated successfully.",
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

    const reviews = await Review.find({})
      .populate({
        path: "createdBy",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("place");

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

exports.updateAdminProfile = async (req, res) => {
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
