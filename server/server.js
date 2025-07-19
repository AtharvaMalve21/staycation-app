const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.config.js");
const connectToCloudinary = require("./config/cloudinary.config.js");

//route handlers
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const placesRoutes = require("./routes/place.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");
const reviewRoutes = require("./routes/review.routes.js");
const AdminRoutes = require("./routes/admin.routes.js");
const paymentRoutes = require("./routes/payment.routes.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

//middlewares
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);
app.use(cookieParser());

//connection with MongoDb
connectDB();

//connection with Cloudinary
connectToCloudinary();

//route handlers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/payment",paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "StayCation App!" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// Fallback route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
