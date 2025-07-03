const Place = require("../models/placesModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");

//only admins can access
exports.addPlace = async (req, res) => {
  try {
    
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User authentication failed. Please log in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action. Only admins can add new listings.",
      });
    }

    //fetch the place details
    const {
      title,
      address,
      description,
      type,
      location,
      perks,
      amenities,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      rules,
    } = req.body;

    //validate the details
    if (
      !title ||
      !address ||
      !description ||
      !perks ||
      !amenities ||
      !extraInfo ||
      !checkIn ||
      !checkOut ||
      !maxGuests ||
      !price ||
      !rules
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled to create a new place.",
      });
    }

    //add photos
    const photos = req.files.map((file) => file.path);

    if (!photos || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one photo is required to publish a place listing. Please upload a photo.",
      });
    }

    //create new place and save it to db
    const newPlace = await Place.create({
      title,
      address,
      description,
      photos,
      type,
      location,
      perks,
      amenities,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      rules,
      owner: userId,
    });

    //return response
    return res.status(201).json({
      success: true,
      data: newPlace,
      message: "New place has been successfully added to the listings.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Server error while adding new place: ${err.message}`,
    });
  }
};

exports.getAllPlaces = async (req, res) => {
  try {
    // get page and limit from query params (with default values)
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const totalPlaces = await Place.countDocuments();
    const places = await Place.find({})
      .populate("owner")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      totalPlaces,
      currentPage: page,
      totalPages: Math.ceil(totalPlaces / limit),
      data: places,
      message: "Places fetched with pagination.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching places.",
      error: err.message,
    });
  }
};

exports.viewPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id).populate("owner");
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No place found with the provided ID.",
      });
    }

    return res.status(200).json({
      success: true,
      data: place,
      message: "Place details retrieved successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error retrieving place: ${err.message}`,
    });
  }
};

exports.filterPlaces = async (req, res) => {
  try {
    const { type } = req.query;

    const places = await Place.find({ type: type }).populate("owner");

    return res.status(200).json({
      success: true,
      data: places,
      message: `Places filtered successfully by type: ${type}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error filtering places: ${err.message}`,
    });
  }
};

//only admins can update this place
exports.updatePlace = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Only admins can update listings.",
      });
    }

    const {
      title,
      address,
      description,
      type,
      location,
      perks,
      amenities,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      rules,
    } = req.body;

    const photos = req.files.map((file) => file.path) || place.photos;

    //find place
    const { id: placeId } = req.params;
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No place found with the given ID.",
      });
    }

    if (place.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    place.title = title || place.title;
    place.address = address || place.address;
    place.description = description || place.description;
    place.photos = photos || place.photos;
    place.type = type || place.type;
    place.location = location || place.location;
    place.perks = perks || place.perks;
    place.amenities = amenities || place.amenities;
    place.extraInfo = extraInfo || place.extraInfo;
    place.checkIn = checkIn || place.checkIn;
    place.checkOut = checkOut || place.checkOut;
    place.maxGuests = maxGuests || place.maxGuests;
    place.price = price || place.price;
    place.rules = rules || place.rules;

    place.status = "inactive";
    await place.save();

    return res.status(200).json({
      success: true,
      data: place,
      message: "Place details updated successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Failed to update place: ${err.message}`,
    });
  }
};

//only admins can delete this place
exports.deletePlace = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User authentication failed.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can delete listings.",
      });
    }

    //find place
    const { id: placeId } = req.params;
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(400).json({
        success: false,
        message: "No place found with the specified ID.",
      });
    }
    if (place.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    await place.deleteOne();

    //delete the user booking
    await Booking.deleteMany({place: placeId});
    

    //delete the user reviews
    await Review.deleteMany({place:placeId});
    
    return res.status(200).json({
      success: true,
      message: "Place has been successfully deleted from the system.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Failed to delete place: ${err.message}`,
    });
  }
};
