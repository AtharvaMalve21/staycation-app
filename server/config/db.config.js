const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(
        `MongoDb connected: ${mongoose.connection.name} ${mongoose.connection.host}`
      );
    })
    .catch((err) => {
      console.log(`Connection failed: ${err.message}`);
      process.exit(1);
    });
};

module.exports = connectDB ;
