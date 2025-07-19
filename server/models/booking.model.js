const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    place: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
  },
  { timestamps: true }
);

// Validate dates and compute duration in hours
bookingSchema.pre("save", function (next) {
  const now = new Date();

  if (this.checkIn < now) {
    return next(new Error("Check-in date and time must be in the future."));
  }

  if (this.checkOut <= this.checkIn) {
    return next(new Error("Check-out must be after check-in."));
  }

  const durationMs = this.checkOut - this.checkIn;
  const durationHours = durationMs / (1000 * 60 * 60); // ms → hours

  this.durationHours = durationHours;

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
