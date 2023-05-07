import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const createUser = (projectId, data) => {
  return axios.post(`projects/${projectId}/users`, data);
};
export const updateUser = (projectId, idUser, data) => {
  return axios.patch(`projects/${projectId}/users/${idUser}`, data);
};
export const deleteUser = (projectId, idUser) => {
  return axios.delete(`projects/${projectId}/users/${idUser}`);
};
export const fetchUser = (projectId, queries) => {
  const url = stringifyUrl({
    url: `/projects/${projectId}/users`,
    query: queries,
  });
  return axios.get(url);
};
