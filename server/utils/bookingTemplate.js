exports.bookingTemplate = (n1, e1, n2, e2, tp, checkIn, checkOut) => {
    return `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #0d6efd; text-align: center; margin-bottom: 20px;">🎉 Booking Confirmed!</h2>
  
          <p style="font-size: 16px;">Hello <strong>${n1}</strong> and <strong>${n2}</strong>,</p>
          <p style="font-size: 15px; margin-bottom: 25px;">We’re excited to let you know that your booking has been successfully confirmed. Here are your booking details:</p>
  
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
              <tr style="background-color: #f1f1f1;">
                <td style="padding: 12px; font-weight: bold;">Guest 1 Name</td>
                <td style="padding: 12px;">${n1}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f1f1f1;">Guest 1 Email</td>
                <td style="padding: 12px;">${e1}</td>
              </tr>
              <tr style="background-color: #f1f1f1;">
                <td style="padding: 12px; font-weight: bold;">Guest 2 Name</td>
                <td style="padding: 12px;">${n2}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f1f1f1;">Guest 2 Email</td>
                <td style="padding: 12px;">${e2}</td>
              </tr>
              <tr style="background-color: #eaf4ea;">
                <td style="padding: 12px; font-weight: bold;">Total Price</td>
                <td style="padding: 12px; font-weight: bold;">₹${tp}</td>
              </tr>
              <tr style="background-color: #f1f1f1;">
                <td style="padding: 12px; font-weight: bold;">Check-in Date</td>
                <td style="padding: 12px;">${checkIn}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f1f1f1;">Check-out Date</td>
                <td style="padding: 12px;">${checkOut}</td>
              </tr>
            </tbody>
          </table>
  
          <p style="font-size: 15px; margin-top: 10px;">Thank you for choosing us! We look forward to providing you a great experience.</p>
  
          <p style="font-size: 13px; color: #777; margin-top: 40px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `;
  };
  