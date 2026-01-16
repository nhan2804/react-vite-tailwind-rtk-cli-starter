import { showLog } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useShowLog = (query) => {
  return useQuery({
    queryKey: ["detail-logs", query],

    queryFn: async () => {
      return await showLog(query);
    }
  });
};

export default useShowLog;
