import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./common/context/auth-context.jsx";
import Loader from "./common/ui/Loader.jsx";
import { LoaderProvider } from "./common/context/LoaderContext.jsx";
import { Toaster } from "react-hot-toast";
import { LayoutProvider } from "./common/context/LayoutContext.jsx";
import Popup from "./common/ui/Popup.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoaderProvider>
      <BrowserRouter>
        <LayoutProvider>
          <AuthProvider>
            <App />
            <Toaster position="top-center" />
            <Loader />
            <Popup />
          </AuthProvider>
        </LayoutProvider>
      </BrowserRouter>
    </LoaderProvider>
  </React.StrictMode>
);
