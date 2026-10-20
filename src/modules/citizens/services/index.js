import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getCitizen = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `citizens`, query })
  );
  return data;
};

export const showCitizen = async (id) => {
  const { data } = await axios.get(`citizens/${id}`);
  return data;
};

export const createCitizen = async (input) => {
  const { data } = await axios.post(`citizens`, input);
  return data;
};

export const createBulkCitizen = async (input) => {
  const { data } = await axios.post(`citizens/bulk/create`, input);
  return data;
};

export const updateCitizen = async (id, input) => {
  const { data } = await axios.patch(`citizens/${id}`, input);
  return data;
};

export const deleteCitizen = async (id) => {
  const { data } = await axios.delete(`citizens/${id}`);
  return data;
};

export const deleteBulkCitizen = async (input) => {
  const { data } = await axios.delete(`citizens/bulk/delete`, { data: { ids: input } });
  return data;
};

export const previewImportCitizen = async (input) => {
  const { data } = await axios.post(`citizens/import/preview`, input);
  return data;
};

export const executeImportCitizen = async (input) => {
  const { data } = await axios.post(`citizens/import`, input);
  return data;
};
