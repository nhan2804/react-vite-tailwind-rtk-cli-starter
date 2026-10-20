import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getExamRecord = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `exam-records`, query })
  );
  return data;
};

export const showExamRecord = async (id) => {
  const { data } = await axios.get(`exam-records/${id}`);
  return data;
};

export const createExamRecord = async (input) => {
  const { data } = await axios.post(`exam-records`, input);
  return data;
};

export const createBulkExamRecord = async (input) => {
  const { data } = await axios.post(`exam-records/bulk/create`, input);
  return data;
};

export const updateExamRecord = async (id, input) => {
  const { data } = await axios.patch(`exam-records/${id}`, input);
  return data;
};

export const deleteExamRecord = async (id) => {
  const { data } = await axios.delete(`exam-records/${id}`);
  return data;
};

export const deleteBulkExamRecord = async (input) => {
  const { data } = await axios.delete(`exam-records/bulk/delete`, { data: { ids: input } });
  return data;
};

export const getExamRecordSummary = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `exam-records/summary`, query })
  );
  return data;
};

export const updateAttendance = async ({ id, arrived }) => {
  const { data } = await axios.patch(`exam-records/${id}/attendance`, { arrived });
  return data;
};

export const updateNote = async ({ id, note }) => {
  const { data } = await axios.patch(`exam-records/${id}/note`, { note });
  return data;
};

export const updateHealthExam = async ({ id, ...payload }) => {
  const { data } = await axios.patch(`exam-records/${id}/health-exam`, payload);
  return data;
};

export const uploadPhoto = async ({ id, file }) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(`exam-records/${id}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const setPrimaryPhoto = async ({ id, photoId }) => {
  const { data } = await axios.patch(`exam-records/${id}/photos/${photoId}/primary`);
  return data;
};

export const deletePhoto = async ({ id, photoId }) => {
  const { data } = await axios.delete(`exam-records/${id}/photos/${photoId}`);
  return data;
};

export const restorePhoto = async ({ id, photoId }) => {
  const { data } = await axios.post(`exam-records/${id}/photos/${photoId}/restore`);
  return data;
};

export const getDeletedPhotos = async (sessionId) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `exam-records/photos/deleted`, query: { sessionId } })
  );
  return data;
};

export const exportHealthExamExcel = async (query) => {
  const response = await axios.get(
    stringifyUrl({ url: `exam-records/export-health-exam`, query }),
    { responseType: "blob" }
  );
  return response.data;
};
