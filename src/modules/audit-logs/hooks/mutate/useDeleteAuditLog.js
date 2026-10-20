import { deleteAuditLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteAuditLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteAuditLog(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['audit-logs'])
    }
  });
};

export default useDeleteAuditLog;
