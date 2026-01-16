import { useQuery } from "@tanstack/react-query";

import { axiosExternal } from "@config/axios";
const useGetInfoGeoIp = () => {
  return useQuery({
    queryKey: ["geo-ip"],

    queryFn: async () => {
      const { data } = await axiosExternal.get("https://ipwhois.app/json/");
      return data;
    }
  });
};

export default useGetInfoGeoIp;
