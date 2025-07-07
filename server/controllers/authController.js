const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendVerificationOTP } = require("../utils/sendVerificationOTP");
const transporter = require("../utils/sendMailer");
const {
  resetPasswordOTPTemplate,
} = require("../utils/resetPasswordOTPTemplate");
const crypto = require("crypto");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Password strength validation function
const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
  return regex.test(password);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, gender, phone, role } = req.body;
    const profilePic = req.file?.path;

    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required to complete registration.",
      });
    }

    if (!name || !email || !password || !gender || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, email, password, gender, phone",
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    //upload profilePic to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "stay-cation",
    });

    //unlink from uploads folder
    fs.unlinkSync(profilePic);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: cloudinaryResponse,
      gender,
      role,
      phone,
    });

    await sendVerificationOTP(email);

    return res.status(201).json({
      success: true,
      data: newUser,
      message:
        "Registration successful. A verification code has been sent to your email.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, and password are required for login.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "No account found with the provided email address.",
      });
    }

    if (!existingUser.isAccountVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is not verified. Please check your email for the verification code.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      data: existingUser,
      message: "Login successful. Welcome back!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login failed due to a server error. Please try again later.",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "You have been logged out successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred during logout. Please try again.",
    });
  }
};

exports.verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    if (otp !== user.verificationCode) {
      return res.status(400).json({
        success: false,
        message: "The verification code entered is incorrect.",
      });
    }

    if (user.verificationCodeExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "The verification code has expired. Please request a new one.",
      });
    }

    user.isAccountVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      data: user,
      message:
        "Your account has been verified successfully. You are now logged in.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide the email associated with your account.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordCode = otp;
    user.resetPasswordCodeExpiresAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.MAIL_HOST,
      to: email,
      subject: "Reset Your Password",
      html: resetPasswordOTPTemplate(user.name, otp),
    });

    return res.status(200).json({
      success: true,
      data: user,
      message: "A password reset code has been sent to your email.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to initiate password reset. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    // Match OTP
    if (otp !== user.resetPasswordCode) {
      return res.status(400).json({
        success: false,
        message: "The password reset code entered is incorrect.",
      });
    }

    // Check OTP expiry
    if (user.resetPasswordCodeExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message:
          "The password reset code has expired. Please request a new one.",
      });
    }

    // Match passwords
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm Password do not match.",
      });
    }

    // Prevent reuse of current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password.",
      });
    }

    // Check password strength
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be strong: minimum 8 characters with uppercase, lowercase, number, and special character.",
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      await bcrypt.genSalt(10)
    );
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Your password has been reset successfully. Please log in with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Password reset failed due to a server error. Please try again.",
    });
  }
};
