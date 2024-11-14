import { useQuery } from "react-query";

import { axiosExternal } from "@config/axios";
const useGetInfoGeoIp = () => {
  return useQuery(
    ["geo-ip"],
    async () => {
      const { data } = await axiosExternal.get("https://ipwhois.app/json/");
      return data;
    },
    {
      onSuccess: (data) => {},
    }
  );
};

export default useGetInfoGeoIp;
