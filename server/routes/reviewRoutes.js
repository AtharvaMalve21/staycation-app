const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { isAuthenticated } = require("../middleware/auth");

router.post("/:id", isAuthenticated, createReview);

router.get("/:id", isAuthenticated, getReviews);

router.put("/:id", isAuthenticated, updateReview);

router.delete("/:id/:reviewId", isAuthenticated, deleteReview);

module.exports = router;
