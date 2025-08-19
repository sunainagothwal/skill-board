import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./common/context/auth-context";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isAuthReady, userInfo, token } = useAuthContext();
  const location = useLocation();
  
  console.log(" PrivateRoute check:", {
    isLoggedIn,
    isAuthReady,
    token,
    userInfo,
    location: location.pathname
  });

  if (!isAuthReady) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} 
      />
    );
  }

  return children;
};

export default PrivateRoute;
