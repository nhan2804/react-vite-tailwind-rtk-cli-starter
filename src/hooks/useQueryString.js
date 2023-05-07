import { getQueryStringValue, setQueryStringValue } from "@helper/queryString";
import { useState, useCallback } from "react";
function useQueryString() {
  const params = new URLSearchParams(window ? window.location.search : {});

  const setOneParams = useCallback((key, newValue) => {
    //   setValue(newValue);
    setQueryStringValue(key, newValue);
  }, []);
  return new Proxy(params, {
    get(target, prop) {
      return target.get(prop);
    },
  });

  //   return { value, onSetValue };
}

export default useQueryString;
