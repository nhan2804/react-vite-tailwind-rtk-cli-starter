import { deleteBulkAuditLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBulkAuditLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkAuditLog(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['audit-logs'])
    }
  });
};

export default useDeleteBulkAuditLog;
