import { useState, useCallback, useEffect } from "react";
import { useHttpClient } from "./http-hook";

export const useAuth = () => {
  const { sendRequest } = useHttpClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Check if user is logged in (on page load)
  useEffect(() => {
    const checkSession = async () => {
      try {
        await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/users/me`,
          "GET"
        );
        setIsLoggedIn(true);
      } catch (err) {
        console.log(err.message)
        setIsLoggedIn(false);
      }
      setIsAuthReady(true);
    };
    checkSession();
  }, [sendRequest]);

  // Manual login
  const login = useCallback(async () => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/me`,
        "GET"
      );
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err.message);
      setIsLoggedIn(false);
    }
  }, [sendRequest]);

  // Manual logout
  const logout = useCallback(async () => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/logout`,
        "POST"
      );
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
    setIsLoggedIn(false);
  }, [sendRequest]);

  return { isLoggedIn, isAuthReady, login, logout };
};
