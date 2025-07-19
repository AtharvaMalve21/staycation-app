import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserContextProvider from "./context/UserContext.jsx";
import { PlaceContextProvider } from "./context/PlaceContext.jsx";
import { BookingContextProvider } from "./context/BookingContext.jsx";
import { ReviewsContextProvider } from "./context/ReviewsContext.jsx";
import { LoaderContextProvider } from "./context/LoaderContext.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StripeProvider from "./context/StripeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <PlaceContextProvider>
        <BookingContextProvider>
          <ReviewsContextProvider>
            <LoaderContextProvider>
              <StripeProvider>
                <App />
              </StripeProvider>
            </LoaderContextProvider>
          </ReviewsContextProvider>
        </BookingContextProvider>
      </PlaceContextProvider>
    </UserContextProvider>
    <Toaster />
  </BrowserRouter>
);
