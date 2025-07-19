const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    place: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ createdBy: 1, place: 1 }, { unique: true });
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
