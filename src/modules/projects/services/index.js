import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getProject = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `projects`, query })
  );
  return data;
};
export const showProject = async (id) => {
  const { data } = await axios.get(`projects/${id}`);
  return data;
};
export const createProject = async (input) => {
  const { data } = await axios.post(`projects`, input);
  return data;
};
export const createBulkProject = async (input) => {
  const { data } = await axios.post(`projects/bulk/create`, input);
  return data;
};
export const updateProject = async (id, input) => {
  const { data } = await axios.patch(`projects/${id}`, input);
  return data;
};
export const deleteProject = async (id) => {
  const { data } = await axios.delete(`projects/${id}`);
  return data;
};
export const deleteBulkProject = async (input) => {
  const { data } = await axios.delete(`projects/bulk/delete`, {data: {ids: input}});
  return data;
};
