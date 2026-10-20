import { deleteBulkExamSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBulkExamSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkExamSession(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-sessions'])
    }
  });
};

export default useDeleteBulkExamSession;
