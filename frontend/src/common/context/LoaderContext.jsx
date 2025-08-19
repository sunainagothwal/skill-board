/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

// Create Context
const LoaderContext = createContext();

// Custom Hook to Use Context
export const useLoader = () => useContext(LoaderContext);

// Provider Component
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
