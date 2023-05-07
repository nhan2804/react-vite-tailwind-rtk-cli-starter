import { useState, useEffect } from "react";

const useGetGPSLocation = () => {
  const [location, setLocation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setIsLoading(false);
      setIsError(false);
    };

    const errorHandler = (error) => {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    };

    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      setIsError(true);
    }
  }, []);

  return { location, isLoading, isError };
};

export default useGetGPSLocation;
