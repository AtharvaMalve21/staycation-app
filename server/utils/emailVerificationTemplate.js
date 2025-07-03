exports.emailVerificationTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f8fa;
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
        background-color: #eaf4ff;
        border-left: 4px solid #007bff;
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
      <h2>Welcome to Booking App!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for registering. Please verify your email using the OTP below:</p>
      <div class="otp-box">${otp}</div>
      <p>This OTP is valid for <strong>15 minutes</strong>. Do not share it with anyone.</p>
      <p>If you did not sign up, you can safely ignore this email.</p>
      <div class="footer">© 2025 Booking App. All rights reserved.</div>
    </div>
  </body>
</html>
`;
};
