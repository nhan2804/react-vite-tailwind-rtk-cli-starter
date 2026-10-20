import { createAuditLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateAuditLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createAuditLog(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['audit-logs'])
    }
  });
};

export default useCreateAuditLog;
