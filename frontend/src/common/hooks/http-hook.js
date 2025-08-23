import { useCallback } from "react";
import { useLoader } from "../context/LoaderContext.jsx";
import { showError } from "../toastHelper.js";

export const useHttpClient = () => {
  const { setLoading } = useLoader();

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      try {
        let requestHeaders = { ...headers };
        let requestBody = body;

        // Only stringify if body is NOT FormData and NOT already a string
        if (body && !(body instanceof FormData) && typeof body !== "string") {
          requestBody = JSON.stringify(body);
          if (!requestHeaders["Content-Type"]) {
            requestHeaders["Content-Type"] = "application/json";
          }
        }

        const response = await fetch(url, {
          method,
          body: method !== "GET" && method !== "HEAD" ? requestBody : null,
          headers: requestHeaders,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed!");
        }

        setLoading(false);
        return responseData;
      } catch (err) {
        showError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [setLoading]
  );

  return { sendRequest };
};
