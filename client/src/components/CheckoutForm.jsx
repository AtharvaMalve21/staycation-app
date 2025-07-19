// CheckoutForm.jsx
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const CheckoutForm = ({ bookingId, onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  const URI = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await axios.get(`${URI}/api/booking/${bookingId}`, {
          withCredentials: true,
        });
        if (data.success) setBooking(data.data);
        else toast.error("Failed to fetch booking.");
      } catch (err) {
        console.error("Fetch booking error:", err);
        toast.error("Could not load booking.");
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      // 1. Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking.name,
            email: booking.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");

        // 2. Update payment status in DB
        await axios.put(
          `${URI}/api/booking/${bookingId}/pay`,
          {
            amount: booking.totalPrice,
            method: "card",
            stripePaymentIntentId: result.paymentIntent.id,
            receiptUrl: result.paymentIntent.charges?.data[0]?.receipt_url,
          },
          { withCredentials: true }
        );

        // 3. Trigger success callback (redirect, UI update, etc.)
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };



  if (!booking) return <p className="text-center">Loading booking...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border p-3 rounded">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#e53e3e" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium py-2 px-4 rounded"
      >
        {loading ? "Processing..." : `Pay ₹${booking.totalPrice}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
