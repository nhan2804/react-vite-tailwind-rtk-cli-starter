// import AUTH_API from "@config/axios/auth";
import axios from "axios";
export const login = (requestData) => {
  console.log(requestData);
  return axios.post("/auth/login", requestData);
};
export const googleLogin = (requestData) => {
  console.log(requestData);
  return axios.post("/auth/google", requestData);
};
export const facebookLogin = (requestData) => {
  console.log(requestData);
  return axios.post("/auth/facebook", requestData);
};
export const register = (requestData) => {
  return axios.post("/auth/register", requestData);
};
export const reset_password = (requestData) => {
  return axios.post("/auth/reset-password", requestData);
};
export const getProfile = () => {
  return axios.get("/auth/profile");
};
export const logout = (requestData) => {
  return axios.post("/auth/logout", requestData);
};
