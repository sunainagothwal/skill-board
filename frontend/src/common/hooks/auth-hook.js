import { useState, useCallback, useEffect } from "react";
import { useHttpClient } from "./http-hook";

export const useAuth = () => {
  const { sendRequest } = useHttpClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState({});

  /* const [user, setUser] = useState(() => {
    // Load user from localStorage on init if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
 */
  // Check if user is logged in (on page load)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/users/me`,
          "GET"
        );

        if (responseData?.user) {
         // localStorage.setItem("user", JSON.stringify(responseData.user));
          setUser(responseData.user);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("Session check failed:", err.message);
       // localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsAuthReady(true);
    };
    checkSession();
  }, [sendRequest]);

  // Manual login
  const login = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/me`,
        "GET"
      );

      if (responseData?.user) {
       // localStorage.setItem("user", JSON.stringify(responseData.user));
        setUser(responseData.user);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.log(err.message);
     // localStorage.removeItem("user");
      setUser(null);
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

    //localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  }, [sendRequest]);

  return { isLoggedIn, isAuthReady, user, login, logout };
};
