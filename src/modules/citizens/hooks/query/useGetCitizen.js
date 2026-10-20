import { getCitizen } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useGetCitizen = (query) => {
  return useQuery({
    queryKey:["citizens",query],
    queryFn:async () => {
      return await getCitizen(query);
    }
  });
};

export default useGetCitizen;
