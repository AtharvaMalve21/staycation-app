import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserContextProvider from "./context/UserContext.jsx";
import { PlaceContextProvider } from "./context/PlaceContext.jsx";
import { BookingContextProvider } from "./context/BookingContext.jsx";
import { ReviewsContextProvider } from "./context/ReviewsContext.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <PlaceContextProvider>
        <BookingContextProvider>
          <ReviewsContextProvider>
            <App />
          </ReviewsContextProvider>
        </BookingContextProvider>
      </PlaceContextProvider>
    </UserContextProvider>
    <Toaster />
  </BrowserRouter>
);
