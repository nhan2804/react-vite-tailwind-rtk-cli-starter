import axios from "axios";
import queryString from "query-string";

export const getTicket = async (query) => {
  const { data } = await axios.get(
    queryString.stringifyUrl({ url: `tickets`, query })
  );
  return data;
};
export const showTicket = async (id) => {
  const { data } = await axios.get(`tickets/${id}`);
  return data;
};
export const createTicket = async (input) => {
  const { data } = await axios.post("tickets", input);
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
