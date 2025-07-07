const Place = require("../models/placesModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

//only admins can add new places
exports.addPlace = async (req, res) => {
  try {
    const userId = req.user._id;

    // Authenticate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only admins can add listings.",
      });
    }

    // Extract and parse fields from req.body
    let {
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

    if (typeof perks === "string") perks = JSON.parse(perks);
    if (typeof amenities === "string") amenities = JSON.parse(amenities);
    if (typeof location === "string") location = JSON.parse(location);

    // Ensure rules is always a string
    if (Array.isArray(rules)) {
      rules = rules.join(", ");
    }
    rules = rules?.trim();

    // Validate required fields
    if (
      !title ||
      !address ||
      !description ||
      !type ||
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
        message: "Please fill all required fields to add a new place.",
      });
    }

    const validTypes = ["Apartment", "Villa", "Cottage", "Room", "Other"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid accommodation type.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one photo is required.",
      });
    }

    // Upload all photos concurrently
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "stay-cation/places",
      })
    );

    let uploadResults;
    try {
      uploadResults = await Promise.all(uploadPromises);
    } catch (err) {
      console.error("Cloudinary error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to upload one or more images.",
      });
    }

    const photoUrls = uploadResults.map((result, i) => {
      fs.unlinkSync(req.files[i].path); // cleanup
      return result.secure_url;
    });

    const newPlace = await Place.create({
      title,
      address,
      description,
      photos: photoUrls,
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

    return res.status(201).json({
      success: true,
      message: "New accommodation added successfully.",
      data: newPlace,
    });
  } catch (err) {
    console.error("❌ Error in addPlace:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding place.",
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

    let filter = {};
    if (type) {
      // Use case-insensitive regex for matching exact type
      filter.type = new RegExp(`^${type}$`, "i");
    }

    const places = await Place.find(filter).populate("owner").lean();

    return res.status(200).json({
      success: true,
      data: places,
      message: type
        ? `Places filtered successfully by type: ${type}`
        : "All places fetched successfully",
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
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
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

    const { id: placeId } = req.params;
    let {
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

    // Parse JSON strings if necessary (coming from FormData)
    if (typeof perks === "string") perks = JSON.parse(perks);
    if (typeof location === "string") location = JSON.parse(location);

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No place found with the given ID.",
      });
    }

    if (place.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not the owner of this listing.",
      });
    }

    // Validate `type` enum
    const validTypes = ["Apartment", "Villa", "Cottage", "Room", "Other"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property type selected.",
      });
    }

    // Upload new photos to Cloudinary (if any)
    let photoUrls = [...place.photos];

    if (req.files && req.files.length > 0) {
      const newPhotoUrls = [];

      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "stay-cation/places",
          });

          newPhotoUrls.push({
            url: result.secure_url,
            public_id: result.public_id,
          });

          fs.unlinkSync(file.path); // delete local file
        } catch (uploadErr) {
          return res.status(500).json({
            success: false,
            message: `Cloudinary upload failed: ${uploadErr.message}`,
          });
        }
      }

      photoUrls = newPhotoUrls;
    }

    // Update fields
    place.title = title || place.title;
    place.address = address || place.address;
    place.description = description || place.description;
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
    place.photos = photoUrls;
    place.status = "inactive"; // mark for review if needed

    await place.save();

    return res.status(200).json({
      success: true,
      message: "Place details updated successfully.",
      data: place,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to update place: ${err.message}`,
    });
  }
};

//only admins can delete this place
exports.deletePlace = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed. Please log in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can delete listings.",
      });
    }

    const { id: placeId } = req.params;
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No place found with the specified ID.",
      });
    }

    if (place.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not the owner of this listing.",
      });
    }

    // Delete photos from Cloudinary
    if (place.photos && place.photos.length > 0) {
      for (const photo of place.photos) {
        let publicId;

        // If photo object includes public_id (recommended)
        if (typeof photo === "object" && photo.public_id) {
          publicId = photo.public_id;
        } else if (typeof photo === "string") {
          // If only URL is stored — fallback logic
          const filename = photo.split("/").pop().split(".")[0];
          publicId = `stay-cation/places/${filename}`;
        }

        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudErr) {
            console.warn(
              `Failed to delete image from Cloudinary: ${cloudErr.message}`
            );
          }
        }
      }
    }

    // Delete place and related data
    await place.deleteOne();
    await Booking.deleteMany({ place: placeId });
    await Review.deleteMany({ place: placeId });

    return res.status(200).json({
      success: true,
      message: "Place and related data successfully deleted.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to delete place: ${err.message}`,
    });
  }
};
