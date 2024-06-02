import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getStoreProject = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `store-projects`, query })
  );
  return data;
};
export const showStoreProject = async (id) => {
  const { data } = await axios.get(`store-projects/${id}`);
  return data;
};
export const createStoreProject = async (input) => {
  const { data } = await axios.post(`store-projects`, input);
  return data;
};
export const createBulkStoreProject = async (input) => {
  const { data } = await axios.post(`store-projects/bulk/create`, input);
  return data;
};
export const updateStoreProject = async (id, input) => {
  const { data } = await axios.patch(`store-projects/${id}`, input);
  return data;
};
export const deleteStoreProject = async (id) => {
  const { data } = await axios.delete(`store-projects/${id}`);
  return data;
};
export const deleteBulkStoreProject = async (input) => {
  const { data } = await axios.delete(`store-projects/bulk/delete`, {data: {ids: input}});
  return data;
};
