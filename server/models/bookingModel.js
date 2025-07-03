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
      enum: ["pending", "confirmed", "cancelled"],
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

bookingSchema.pre("save", function (next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error("Check-out date must be after check-in date."));
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
