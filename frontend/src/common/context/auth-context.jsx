/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/auth-hook";

const AuthContext = createContext(null); // ✅ default null for safety

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // contains { token, login, logout, userInfo }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};

/* import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token:null,
  userInfo:{},
  login: () => {},
  logout: () => {}
}); */
