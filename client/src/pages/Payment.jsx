// PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import CheckoutForm from "../components/CheckoutForm.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  const URI = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post(
          `${URI}/api/payment/create-payment-intent`,
          { bookingId: id },
          { withCredentials: true }
        );
        setClientSecret(data.data); // assuming data.data = clientSecret
      } catch (error) {
        console.error("Error fetching clientSecret:", error);
        toast.error("Could not initialize payment.");
      }
    };

    fetchClientSecret();
  }, [id]);

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Complete Payment</h2>

        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              bookingId={id}
              clientSecret={clientSecret}
              onSuccess={() => {
                navigate("/payment-success");
              }}
            />
          </Elements>
        ) : (
          <p className="text-center">Loading payment info...</p>
        )}
      </div>
    </div>
  );
};

export default Payment;
