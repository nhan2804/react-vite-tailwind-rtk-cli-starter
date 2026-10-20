import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getAuditLog = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `audit-logs`, query })
  );
  return data;
};
export const showAuditLog = async (id) => {
  const { data } = await axios.get(`audit-logs/${id}`);
  return data;
};
export const createAuditLog = async (input) => {
  const { data } = await axios.post(`audit-logs`, input);
  return data;
};
export const createBulkAuditLog = async (input) => {
  const { data } = await axios.post(`audit-logs/bulk/create`, input);
  return data;
};
export const updateAuditLog = async (id, input) => {
  const { data } = await axios.patch(`audit-logs/${id}`, input);
  return data;
};
export const deleteAuditLog = async (id) => {
  const { data } = await axios.delete(`audit-logs/${id}`);
  return data;
};
export const deleteBulkAuditLog = async (input) => {
  const { data } = await axios.delete(`audit-logs/bulk/delete`, {data: {ids: input}});
  return data;
};
