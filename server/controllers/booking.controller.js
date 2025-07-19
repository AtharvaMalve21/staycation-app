const Booking = require("../models/booking.model.js");
const Place = require("../models/place.model.js");
const User = require("../models/user.model.js");
const transporter = require("../utils/sendMailer");
const dotenv = require("dotenv");
const { bookingTemplate } = require("../utils/bookingTemplate");
const Payment = require("../models/payment.model.js");
dotenv.config();

exports.addNewBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });

    if (user.role === "admin")
      return res.status(401).json({
        success: false,
        message: "Admins cannot book a place.",
      });

    const { id } = req.params; // Place ID
    const place = await Place.findById(id);
    if (!place)
      return res.status(404).json({
        success: false,
        message: "No Place found.",
      });

    const { name, email, checkIn, checkOut, guests } = req.body;

    if (!name || !email || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();

    // Remove time part for date-only comparison
    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (checkInDate <= now) {
      return res.status(400).json({
        success: false,
        message: "Check-in must be a future date.",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    const diffInMs = checkOutDate - checkInDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // Days difference

    const totalPrice = diffInDays * place.price * guests;

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      place: place._id,
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: "This place is already booked for the selected dates.",
      });
    }

    //check same user cannot book the same place
    const existingBooking = await Booking.findOne({
      user: user._id,
      place: place._id,
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this place for the selected dates.",
      });
    }

    // Create booking with unpaid status
    const booking = await Booking.create({
      user: userId,
      place: place._id,
      name,
      email,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      maxGuests: guests,
      totalPrice,
      paymentStatus: "unpaid",
    });

    // Send confirmation email
    try {
      await transporter.sendMail({
        from: process.env.MAIL_HOST,
        to: [user.email, email],
        subject: `Booking Confirmation for ${place.title}`,
        html: bookingTemplate(
          user.name,
          user.email,
          name,
          email,
          totalPrice,
          checkIn,
          checkOut
        ),
      });

      return res.status(201).json({
        success: true,
        message:
          "Booking successful! A confirmation email has been sent to your registered email address.",
      });
    } catch (emailErr) {
      console.warn("Email failed:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      data: booking,
      message:
        "Booking successful! Please complete the payment to confirm your stay.",
    });
  } catch (err) {
    console.error("Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error: " + err.message,
    });
  }
};

exports.markBookingPaid = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id; // from isAuthenticated middleware
    const {
      amount,
      method,
      stripePaymentIntentId,
      receiptUrl,
      currency = "inr",
    } = req.body;

    // Update booking's paymentStatus (not the status!)
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      user: userId,
      amount,
      method,
      stripePaymentIntentId,
      receiptUrl,
      status: "succeeded",
      currency,
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Booking payment recorded and paymentStatus updated",
      booking,
      payment,
    });
  } catch (error) {
    console.error("Payment saving error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate("place")
      .populate({
        path: "user",
        populate: {
          path: "additionalDetails",
        },
      });

    return res.status(200).json({
      success: true,
      data: bookings,
      message: "Booking data fetched.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingsForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({})
      .populate("place")
      .populate({
        path: "user",
        populate: {
          path: "additionalDetails",
        },
      });

    return res.status(200).json({
      success: true,
      data: bookings,
      message: "Booking data fetched.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.viewBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const booking = await Booking.findById(req.params.id)
      .populate("place")
      .populate({
        path: "user",
        populate: {
          path: "additionalDetails",
        },
      });
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });

    if (
      booking.user._id.toString() !== userId.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking.",
      });
    }

    return res
      .status(200)
      .json({ success: true, data: booking, message: "Booking data fetched." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.editBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;
    const { checkIn, checkOut, name, email } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past.",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this booking.",
      });
    }

    if (["cancelled", "completed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot edit a ${booking.status} booking.`,
      });
    }

    const place = await Place.findById(booking.place);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Associated place not found.",
      });
    }

    const durationInHours = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60)
    );
    const totalPrice = durationInHours * place.price;

    const priceChanged = totalPrice !== booking.totalPrice;

    // Update fields
    booking.name = name || booking.name;
    booking.email = email || booking.email;
    booking.checkIn = checkInDate;
    booking.checkOut = checkOutDate;
    booking.durationHours = durationInHours;
    booking.totalPrice = totalPrice;

    // If booking was paid and total changed, reset payment status
    if (booking.paymentStatus === "paid" && priceChanged) {
      booking.paymentStatus = "unpaid";
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      booking,
    });
  } catch (err) {
    console.error("Error editing booking:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the booking.",
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    // Only the booking owner can cancel it (or allow admin later if needed)
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled.",
      });
    }

    // Optional: Check if the check-in date is already passed
    if (new Date() >= booking.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a booking that has already started.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking,
    });
  } catch (err) {
    console.error("Cancel Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while cancelling the booking.",
    });
  }
};
