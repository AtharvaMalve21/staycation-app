// StripeWrapper.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

// Load Stripe with the Vite env variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log(stripePromise);

const StripeWrapper = ({ bookingData, onSuccess }) => {
    if (!stripePromise) {
        console.error("Stripe failed to initialize. Check your publishable key.");
        return <p>Stripe is not ready...</p>;
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm bookingData={bookingData} onSuccess={onSuccess} />
        </Elements>
    );
};

export default StripeWrapper;
