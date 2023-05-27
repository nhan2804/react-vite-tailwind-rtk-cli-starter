import axios from "axios";
import queryString from "query-string";

export const get__name__(sentenceCase) = async (query) => {
  const { data } = await axios.get(
    queryString.stringifyUrl({ url: `__path_api__`, query })
  );
  return data;
};
export const show__name__(sentenceCase) = async (id) => {
  const { data } = await axios.get(`__path_api__/${id}`);
  return data;
};
export const create__name__(sentenceCase) = async (input) => {
  const { data } = await axios.post("__path_api__", input);
  return data;
};
export const update__name__(sentenceCase) = async (id, input) => {
  const { data } = await axios.patch(`__path_api__/${id}`, input);
  return data;
};
export const delete__name__(sentenceCase) = async (id) => {
  const { data } = await axios.delete(`__path_api__/${id}`);
  return data;
};
