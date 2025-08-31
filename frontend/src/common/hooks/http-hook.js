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
          credentials: "include",
        });

        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};

        if (!response.ok) {
          // ✅ Only show toast for URLs other than /users/me
          if (!url.includes("/users/me")) {
            showError(responseData.message || "Request failed!");
          }
          throw new Error(responseData.message || "Request failed!");
        }

        return responseData;
      } catch (err) {
        if (!url.includes("/users/me")) {
          showError(err.message || "Something went wrong!");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return { sendRequest };
};

