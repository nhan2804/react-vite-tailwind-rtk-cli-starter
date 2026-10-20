import { getAuditLog } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useGetAuditLog = (query, options = {}) => {
  return useQuery({
    queryKey: ["audit-logs", query],
    queryFn: async () => {
      return await getAuditLog(query);
    },
    ...options,
  });
};

export default useGetAuditLog;
