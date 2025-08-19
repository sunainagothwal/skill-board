import {useCallback } from 'react';
import { useLoader } from "../context/LoaderContext.jsx";
import { useNotification } from "../context/NotificationContext";

export const useHttpClient = () => {
  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const { setLoading } = useLoader();
  const { showError } = useNotification();

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setLoading(false);
        return responseData;
      } catch (err) {
        showError(err.message);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return { sendRequest };
};
