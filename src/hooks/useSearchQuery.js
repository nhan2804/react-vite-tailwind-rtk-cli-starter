import { useState } from "react";
import useQueryString2 from "./useQueryString2";

const useSearchQuery = () => {
  const { qsParsed } = useQueryString2();
  console.log({ qsParsed });
  const [search, setSearch] = useState(qsParsed || {});

  const handleSetSearch = (values) => {
    Object.keys(values).forEach((key) => {
      if (!values[key]) {
        delete values[key];
      }
    });
    setSearch(values);
  };
  return {
    initSearchValues: qsParsed,
    setSearch: handleSetSearch,
    search: search || {},
  };
};

export default useSearchQuery;
