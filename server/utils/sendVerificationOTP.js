const User = require("../models/userModel");
const transporter = require("./sendMailer");
const dotenv = require("dotenv");
const { emailVerificationTemplate } = require("./emailVerificationTemplate");
dotenv.config();

exports.sendVerificationOTP = async (email) => {
  //find the user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Email does not exists.",
    });
  }

  const otp = await user.generateVerificationOTP();

  return await transporter.sendMail({
    from: process.env.MAIL_HOST,
    to: email,
    subject: "Account Verification OTP",
    html: emailVerificationTemplate(user.name, otp),
  });
};
