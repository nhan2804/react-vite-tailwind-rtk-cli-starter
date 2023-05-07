import { useSearchParams } from "react-router-dom";
import queryString from "query-string";
import qs from "qs";

const useQueryString2 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const qsParsed = queryString.parse(window.location.search);
  const qsParsed2 = qs.parse(window.location.search?.replace("?", ""));
  return { searchParams, setSearchParams, qsParsed, qsParsed2 };
};

export default useQueryString2;
