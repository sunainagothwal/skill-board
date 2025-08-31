import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./common/context/auth-context";
import { useLoader } from "./common/context/LoaderContext.jsx";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isAuthReady } = useAuthContext();
  const { setLoading } = useLoader();
  const location = useLocation();

  // Show loader until auth check is done
  useEffect(() => {
    setLoading(!isAuthReady);
  }, [isAuthReady, setLoading]);

  if (!isAuthReady) {
    // Wait until auth check completes
    return null;
  }

  if (!isLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is logged in, render the protected content
  return children;
};

export default PrivateRoute;
