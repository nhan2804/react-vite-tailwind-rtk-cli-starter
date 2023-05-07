import React, { useEffect, useState } from "react";

const useMediaQuery = (query) => {
  const [match, setMatch] = useState(window.matchMedia(query));
  useEffect(() => {
    const listener = (x) => {
      console.log(x);
      if (x.matches !== match) setMatch(x.matches);
    };
    const x = window.matchMedia(query);
    x.addEventListener("change", listener);
    return () => {
      x.removeEventListener("change", listener);
    };
  }, []);
  return [match];
};

export default useMediaQuery;
