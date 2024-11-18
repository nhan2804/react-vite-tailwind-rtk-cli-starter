import { getLog } from "../../services/index";
import { useQuery } from "react-query";

const useGetLog = (query) => {
  return useQuery({
    queryKey:["logs",query],
    queryFn:async () => {
      return await getLog(query);
    }
  });
};

export default useGetLog;
