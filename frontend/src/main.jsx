import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./common/context/auth-context.jsx";
//import Loader from "./common/ui/Loader.jsx";
import { LoaderProvider } from "./common/context/LoaderContext.jsx";  
import { NotificationProvider } from "./common/context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoaderProvider>
    <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificationProvider>
    </BrowserRouter>
     </LoaderProvider>
  </React.StrictMode>
);
