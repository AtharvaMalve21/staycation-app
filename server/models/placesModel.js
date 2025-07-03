const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Apartment", "Villa", "Cottage", "Room", "Other"],
      default: "Apartment",
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    perks: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    extraInfo: {
      type: String,
    },
    checkIn: {
      type: Number,
      required: true,
    },
    checkOut: {
      type: Number,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rules: {
      type: String,
    },
    cancellationPolicy: {
      type: String,
      enum: ["Flexible", "Moderate", "Strict"],
      default: "Moderate",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
