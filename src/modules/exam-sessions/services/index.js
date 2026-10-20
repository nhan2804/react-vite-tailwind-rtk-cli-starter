import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getExamSession = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `exam-sessions`, query })
  );
  return data;
};

export const showExamSession = async (id) => {
  const { data } = await axios.get(`exam-sessions/${id}`);
  return data;
};

export const createExamSession = async (input) => {
  const { data } = await axios.post(`exam-sessions`, input);
  return data;
};

export const createBulkExamSession = async (input) => {
  const { data } = await axios.post(`exam-sessions/bulk/create`, input);
  return data;
};

export const updateExamSession = async (id, input) => {
  const { data } = await axios.patch(`exam-sessions/${id}`, input);
  return data;
};

export const activateExamSession = async (id) => {
  const { data } = await axios.patch(`exam-sessions/${id}/activate`);
  return data;
};

export const deleteExamSession = async (id) => {
  const { data } = await axios.delete(`exam-sessions/${id}`);
  return data;
};

export const deleteBulkExamSession = async (input) => {
  const { data } = await axios.delete(`exam-sessions/bulk/delete`, { data: { ids: input } });
  return data;
};
