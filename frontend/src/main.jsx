import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./common/context/auth-context.jsx";
import Loader from "./common/ui/Loader.jsx";
import { LoaderProvider } from "./common/context/LoaderContext.jsx";
import { Toaster } from "react-hot-toast";
import { PopupProvider } from "./common/context/PopupContext.jsx";
import Popup from "./common/ui/Popup.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoaderProvider>
      <BrowserRouter>
        <PopupProvider>
          <AuthProvider>
            <App />
            <Toaster position="top-center" />
            <Loader />
            <Popup />
          </AuthProvider>
        </PopupProvider>
      </BrowserRouter>
    </LoaderProvider>
  </React.StrictMode>
);
