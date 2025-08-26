/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState(null);

  const openPopup = (id, data) => {
    setPopup({ id, ...data });
  };

  const closePopup = () => {
    setPopup(null);
  };

  return (
    <PopupContext.Provider value={{ popup, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
