import { showAuditLog } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useShowAuditLog = (query) => {
  return useQuery(["detail-audit-logs",query], async () => {
    return await showAuditLog(query);
  });
};

export default useShowAuditLog;
