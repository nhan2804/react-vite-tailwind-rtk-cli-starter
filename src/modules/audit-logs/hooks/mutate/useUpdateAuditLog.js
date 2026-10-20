import { updateAuditLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateAuditLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateAuditLog(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['audit-logs'])
    }
  });
};

export default useUpdateAuditLog;
