const User = require("../models/userModel");
const Place = require("../models/placesModel");
const Review = require("../models/reviewModel");

exports.createReview = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User found.",
      });
    }

    if (user.role == "admin") {
      return res.status(400).json({
        success: false,
        message: "Admins cannot review.",
      });
    }

    //fetch review data
    const { body, rating } = req.body;

    //validate details
    if (!body || !rating) {
      return res.status(400).json({
        success: false,
        message: "Body and rating fields are required.",
      });
    }

    const { id: placeId } = req.params;

    //find place
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(400).json({
        success: false,
        message: "Place not found.",
      });
    }

    //create review
    const review = await Review.create({
      body,
      rating,
      createdBy: userId,
      place: placeId,
    });

    return res.status(201).json({
      success: true,
      data: review,
      message: "Review added successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User found.",
      });
    }

    const { id: placeId } = req.params;

    //find place
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(400).json({
        success: false,
        message: "Place not found.",
      });
    }

    const review = await Review.find({ place: place._id }).populate("createdBy place");

    return res.status(200).json({
      success: true,
      data: review,
      message: "Reviews data fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateReview = async (req, res) => {
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

    if (user.role == "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot access this route.",
      });
    }

    //find the review
    const { id: reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(400).json({
        success: false,
        message: "No Review found.",
      });
    }

    //check if the authorized user can update this review
    if (review.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to update this review.",
      });
    }

    const { body, rating } = req.body;

    review.body = body || review.body;
    review.rating = rating || review.rating;

    await review.save();

    return res.status(200).json({
      success: true,
      data: review,
      message: "Review updated.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    const { id, reviewId } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found.",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "No Review found.",
      });
    }

    //check if the user is authorized to delete this place
    if (review.createdBy.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized to delete this review",
      });
    }

    await review.deleteOne({ _id: reviewId });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
