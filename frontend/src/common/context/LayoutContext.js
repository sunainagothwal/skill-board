// src/common/context/LayoutContext.js
import React, { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [popup, setPopup] = useState(null);

  const openPopup = (id, data) => {
    setPopup({ id, ...data });
  };

  const closePopup = () => {
    setPopup(null);
  };

  return (
    <LayoutContext.Provider value={{ popup, openPopup, closePopup }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
