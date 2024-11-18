import { axiosLogs } from "@config/axios";
import stringifyUrl from "@helper/stringifyUrl";

export const getLog = async (query) => {
  const { data } = await axiosLogs.get(
    stringifyUrl({ url: `activities`, query })
  );
  return data;
};
export const showLog = async (id) => {
  const { data } = await axiosLogs.get(`activities/${id}`);
  return data;
};
export const createLog = async (input) => {
  const { data } = await axiosLogs.post(`activities`, input);
  return data;
};
export const createBulkLog = async (input) => {
  const { data } = await axiosLogs.post(`activities/bulk/create`, input);
  return data;
};
export const updateLog = async (id, input) => {
  const { data } = await axiosLogs.patch(`activities/${id}`, input);
  return data;
};
export const deleteLog = async (id) => {
  const { data } = await axiosLogs.delete(`activities/${id}`);
  return data;
};
export const deleteBulkLog = async (input) => {
  const { data } = await axiosLogs.delete(`activities/bulk/delete`, {
    data: { ids: input },
  });
  return data;
};
