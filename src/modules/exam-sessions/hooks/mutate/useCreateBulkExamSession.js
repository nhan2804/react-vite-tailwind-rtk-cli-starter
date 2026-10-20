import { createBulkExamSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateBulkExamSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkExamSession(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-sessions'])
    }
  });
};

export default useCreateBulkExamSession;
