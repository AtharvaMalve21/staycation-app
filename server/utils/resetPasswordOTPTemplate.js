exports.resetPasswordOTPTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        padding: 30px;
        color: #333;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 25px;
        max-width: 500px;
        margin: auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
      }
      .otp-box {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 15px;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        font-size: 13px;
        color: #777;
        margin-top: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>We received a request to reset your password. Use the OTP below:</p>
      <div class="otp-box">${otp}</div>
      <p>This OTP is valid for <strong>15 minutes</strong>. If you didn’t request this, you can ignore this email.</p>
      <div class="footer">Stay secure, Booking App Team</div>
    </div>
  </body>
</html>
`;
};
