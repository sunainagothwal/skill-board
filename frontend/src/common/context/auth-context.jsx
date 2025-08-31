/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/auth-hook";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={useAuth()}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};
