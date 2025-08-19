import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null); 
  const [tokenExpirationTimer, setTokenExpirationTimer] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = useCallback((user, token, expirationDate) => {
    setToken(token);
    setUserInfo(user);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

    setTokenExpirationTimer(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        user,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    setIsAuthReady(true);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationTimer(null);
    setUserInfo(null);
    localStorage.removeItem("userData");
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (token && tokenExpirationTimer) {
      const remainingTime =
        tokenExpirationTimer.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationTimer]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.user,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
    setIsAuthReady(true);
  }, [login]);

  return {
    token,
    login,
    logout,
    userInfo,
    isLoggedIn: !!token,
    isAuthReady,
  };
};
