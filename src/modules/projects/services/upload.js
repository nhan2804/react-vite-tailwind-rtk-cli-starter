import axios from "axios";

export const uploadFile = (data) => {
  return axios.post(`upload/s3`, data);
};
