import { createBulkAuditLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateBulkAuditLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkAuditLog(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['audit-logs'])
    }
  });
};

export default useCreateBulkAuditLog;
