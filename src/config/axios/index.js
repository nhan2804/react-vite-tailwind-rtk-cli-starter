import { logout } from "@modules/auth/slices";
import axios from "axios";
import { store } from "@app/store";
// let BASE_URL = "https://manager-store.168-work.space/";
let BASE_URL = "http://localhost:4002/";
let BASE_URL_EMBED = "http://localhost:8000/";
let BASE_URL_WS = "http://localhost:5000/";
let BASE_URL_JS_EMBED = "http://localhost:5000/";
let BASE_URL_SSO = "http://auth.168-work.space/";
let API_IMGBB_KEY = "ef456e4869f97e66128f272ec46b4d34";
let BASE_URL_UPLOAD = "fff";
export {
  BASE_URL,
  BASE_URL_WS,
  BASE_URL_EMBED,
  BASE_URL_JS_EMBED,
  API_IMGBB_KEY,
  BASE_URL_UPLOAD,
  BASE_URL_SSO,
};
axios.defaults.baseURL = `${BASE_URL}v1/api`;
// axios.defaults.withCredentials = true;

export const configAxios = () => {
  axios.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        const token = store.getState().auth?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;
      const url = originalConfig?.url;

      if (error.response && url !== "/auth/refresh" && url !== "/auth/login") {
        //@ts-ignore
        if (error.response.status === 401) {
          //@ts-ignore
          try {
            store.dispatch(logout());
            // const { data } = await refresh_token();
            // const userInfo = JSON.parse(Cookies.get("userInfo"));
            // const access_token = data?.access_token;
            // store.dispatch(updateToken({ access_token }));
            // originalConfig.headers["Authorization"] = `Bearer ${access_token}`;
            // return axios(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
