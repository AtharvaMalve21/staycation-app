exports.bookingTemplate = (
  userName,
  userEmail,
  guestName,
  guestEmail,
  totalPrice,
  checkIn,
  checkOut
) => {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; color: #333; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">🎉 Booking Confirmed!</h2>
      
      <p>Hi <strong>${userName}</strong>,</p>

      <p>Thank you for booking with us. Here are your booking details:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">👤 Guest Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${guestName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">📧 Guest Email:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${guestEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">📅 Check-in:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(checkIn).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">📅 Check-out:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(checkOut).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">💰 Total Price:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${totalPrice}</td>
        </tr>
      </table>

      <p style="margin-top: 20px;">If you have any questions or need to make changes, feel free to reply to this email.</p>

      <p style="margin-top: 30px;">Safe travels,</p>
      <p><strong>The Staycation Team</strong></p>

      <hr style="margin-top: 40px;" />
      <p style="font-size: 12px; color: #777; text-align: center;">
        This is an automated email – please do not reply directly to this message.
      </p>
    </div>
  `;
};
