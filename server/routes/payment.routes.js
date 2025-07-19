const express = require("express");
const router = express.Router();

const {
  createPaymentIntent,
  stripeWebhook,
} = require("../controllers/payment.controller.js");

const { isAuthenticated } = require("../middleware/auth.middleware.js");

router.post("/create-payment-intent", isAuthenticated, createPaymentIntent);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
