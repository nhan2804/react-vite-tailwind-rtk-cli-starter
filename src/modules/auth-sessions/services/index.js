import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getAuthSession = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `auth-session`, query })
  );
  return data;
};
export const showAuthSession = async (id) => {
  const { data } = await axios.get(`auth-session/${id}`);
  return data;
};
export const createAuthSession = async (input) => {
  const { data } = await axios.post(`auth-session`, input);
  return data;
};
export const createBulkAuthSession = async (input) => {
  const { data } = await axios.post(`auth-session/bulk/create`, input);
  return data;
};
export const updateAuthSession = async (id, input) => {
  const { data } = await axios.patch(`auth-session/${id}`, input);
  return data;
};
export const deleteAuthSession = async (id) => {
  const { data } = await axios.delete(`auth-session/${id}`);
  return data;
};
export const deleteBulkAuthSession = async (input) => {
  const { data } = await axios.delete(`auth-session/bulk/delete`, {data: {ids: input}});
  return data;
};
