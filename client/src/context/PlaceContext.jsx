import { createContext, useState } from "react";

export const PlaceContext = createContext({});

export const PlaceContextProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);

  return (
    <PlaceContext.Provider value={{ places, setPlaces }}>
      {children}
    </PlaceContext.Provider>
  );
};
