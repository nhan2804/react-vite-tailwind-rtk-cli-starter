import { getLog } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useGetLog = (query) => {
  return useQuery({
    queryKey: ["logs", query],
    queryFn: async () => {
      return await getLog(query);
    },
  });
};

export default useGetLog;
