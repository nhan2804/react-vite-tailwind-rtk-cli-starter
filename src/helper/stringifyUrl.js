import qs from "qs";

const stringifyUrl = ({ url, query }) => {
  return `${url?.replace("?", "")}?${qs.stringify(query)}`;
};
export default stringifyUrl;
