const Booking = require("../models/bookingModel");
const Place = require("../models/placesModel");
const User = require("../models/userModel");
const transporter = require("../utils/sendMailer");
const dotenv = require("dotenv");
const { bookingTemplate } = require("../utils/bookingTemplate");
dotenv.config();

exports.addNewBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    if (user.role === "admin") {
      return res.status(401).json({
        success: false,
        message: "Admins cannot book a place.",
      });
    }

    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found. Please add one.",
      });
    }

    // Get data from body
    const { name, email, checkIn, checkOut, maxGuests } = req.body;

    // Basic validation
    if (!name || !email || !checkIn || !checkOut || !maxGuests) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required details.",
      });
    }

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    // Calculate total price
    const totalPrice = place.price * nights * maxGuests;

    const conflicting = await Booking.findOne({
      place: place._id,
      $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }],
    });

    if (conflicting) {
      return res.status(400).json({
        success: false,
        message:
          "This place is already booked for the selected dates. Please choose different dates.",
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      place: place._id,
      name,
      email,
      checkIn,
      checkOut,
      maxGuests,
      totalPrice,
    });

    await transporter.sendMail({
      from: process.env.MAIL_HOST,
      to: [user.email, email],
      subject: `Booking Confirmation ${place.title} from ${place.checkIn} to ${place.checkOut}`,
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
      data: booking,
      message: "Booking confirmation is sent to your email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error: " + err.message,
    });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }

    const booking = await Booking.find({ user: userId })
      .populate("user")
      .populate("place");
    return res.status(200).json({
      success: true,
      data: booking,
      message: "Booking data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBookingsForAdmin = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        mesasge: "No User found. Login Again.",
      });
    }

    var bookings = [];

    if (user.role === "admin") {
      bookings = await Booking.find({}).populate("user").populate("place");
    }

    return res.status(200).json({
      success: true,
      data: bookings,
      message: "Booking data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.viewBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("user")
      .populate("place");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
      message: "Booking data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.editBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Login again.",
      });
    }

    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No booking found.",
      });
    }

    // Only the booking owner can edit
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this booking.",
      });
    }

    const { name, email, checkIn, checkOut, maxGuests } = req.body;

    // Basic validation
    if (!name || !email || !checkIn || !checkOut || !maxGuests) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required details.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    // Fetch place to calculate new total price
    const place = await Place.findById(booking.place);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Associated place not found.",
      });
    }

    const totalPrice = place.price * nights * maxGuests;

    // Update booking
    booking.name = name;
    booking.email = email;
    booking.checkIn = checkIn;
    booking.checkOut = checkOut;
    booking.maxGuests = maxGuests;
    booking.totalPrice = totalPrice;

    await booking.save();

    // Send updated confirmation email
    await transporter.sendMail({
      from: process.env.MAIL_HOST,
      to: [user.email, email],
      subject: `Booking Updated: ${place.title} (${checkIn} to ${checkOut})`,
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

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }

    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No Booking found.",
      });
    }

    //check whether the user is authorized to delete this booking
    if (booking.user.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized to delete this booking.",
      });
    }

    await booking.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

