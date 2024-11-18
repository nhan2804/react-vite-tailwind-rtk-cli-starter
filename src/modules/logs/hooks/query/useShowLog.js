import { showLog } from "../../services/index";
import { useQuery } from "react-query";

const useShowLog = (query) => {
  return useQuery(["detail-logs",query], async () => {
    return await showLog(query);
  });
};

export default useShowLog;
