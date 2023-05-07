import axios from "axios";

export const createProject = (data) => {
  return axios.post("projects", data);
};
export const updateProject = (idProject, data) => {
  return axios.patch(`projects/${idProject}`, data);
};
export const deleteProject = (idProject) => {
  return axios.delete(`projects/${idProject}`);
};
export const fetchProject = () => {
  return axios.get("projects");
};
export const showProject = (id) => {
  return axios.get(`projects/${id}`);
};
