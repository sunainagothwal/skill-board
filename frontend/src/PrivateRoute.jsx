import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./common/context/auth-context";
import { useLoader } from "./common/context/LoaderContext.jsx";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isAuthReady } = useAuthContext();
  const { setLoading } = useLoader();
  const location = useLocation();

  // Only update loader after render
  useEffect(() => {
    setLoading(!isAuthReady);
  }, [isAuthReady, setLoading]);

  if (!isAuthReady) {
    // Render nothing because loader is already showing
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
