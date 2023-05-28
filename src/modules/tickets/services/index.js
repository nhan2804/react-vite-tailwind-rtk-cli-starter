import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getTicket = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `tickets`, query })
  );
  return data;
};
export const showTicket = async (id) => {
  const { data } = await axios.get(`tickets/${id}`);
  return data;
};
export const createTicket = async (input) => {
  const { data } = await axios.post(`tickets`, input);
  return data;
};
export const createBulkTicket = async (input) => {
  const { data } = await axios.post(`tickets/bulk/create`, input);
  return data;
};
export const updateTicket = async (id, input) => {
  const { data } = await axios.patch(`tickets/${id}`, input);
  return data;
};
export const deleteTicket = async (id) => {
  const { data } = await axios.delete(`tickets/${id}`);
  return data;
};
export const deleteBulkTicket = async (input) => {
  const { data } = await axios.delete(`tickets/bulk/delete`, {data: {ids: input}});
  return data;
};
