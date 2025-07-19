const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is already paid" });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalPrice * 100, // Stripe expects amount in cents
      currency: "inr",
      metadata: {
        bookingId: booking._id.toString(),
        userId: userId.toString(),
      },
    });

    // Save Payment in MongoDB
    const newPayment = new Payment({
      user: userId,
      booking: booking._id,
      amount: booking.totalPrice,
      currency: "inr",
      status: "pending", // will be updated on webhook
      stripePaymentIntentId: paymentIntent.id,
    });

    await newPayment.save();

    res.status(200).json({
      success: true,
      data: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Stripe Webhook for Payment Confirmation
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const metadata = paymentIntent.metadata;

    try {
      const booking = await Booking.findOne({
        _id: metadata.bookingId,
        paymentStatus: "unpaid",
      });

      if (!booking) {
        console.log("⚠️ Booking not found or already paid.");
        return res.status(200).send("Already handled or no such booking");
      }

      // Update booking status
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.paymentIntentId = paymentIntent.id;
      await booking.save();

      // Save to Payment model
      await Payment.create({
        user: booking.user,
        booking: booking._id,
        paymentIntentId: paymentIntent.id,
        amount: booking.totalPrice,
        status: "succeeded",
        currency: paymentIntent.currency,
      });

      console.log("✅ Booking updated and payment saved.");
    } catch (err) {
      console.error("❌ Error during booking/payment update:", err);
      return res.status(500).send("Webhook processing failed");
    }
  } else {
    console.log(`🔔 Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
