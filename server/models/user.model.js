const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    additionalDetails: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpiresAt: {
      type: Date,
    },
    resetPasswordCode: {
      type: String,
    },
    resetPasswordCodeExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateVerificationOTP = async function () {
  const otp = crypto.randomInt(100000, 999999).toString();
  this.verificationCode = otp;
  this.verificationCodeExpiresAt = Date.now() + 15 * 60 * 1000; //15 minutes
  await this.save();
  return otp;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
