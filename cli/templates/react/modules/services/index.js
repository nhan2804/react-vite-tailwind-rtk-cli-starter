import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const get__name__(pascalCase) = async (__params__query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `__path_api__`, query })
  );
  return data;
};
export const show__name__(pascalCase) = async (__params__id) => {
  const { data } = await axios.get(`__path_api__/${id}`);
  return data;
};
export const create__name__(pascalCase) = async (__params__input) => {
  const { data } = await axios.post(`__path_api__`, input);
  return data;
};
export const createBulk__name__(pascalCase) = async (__params__input) => {
  const { data } = await axios.post(`__path_api__/bulk/create`, input);
  return data;
};
export const update__name__(pascalCase) = async (__params__id, input) => {
  const { data } = await axios.patch(`__path_api__/${id}`, input);
  return data;
};
export const delete__name__(pascalCase) = async (__params__id) => {
  const { data } = await axios.delete(`__path_api__/${id}`);
  return data;
};
export const deleteBulk__name__(pascalCase) = async (__params__input) => {
  const { data } = await axios.delete(`__path_api__/bulk/delete`, {data: {ids: input}});
  return data;
};
