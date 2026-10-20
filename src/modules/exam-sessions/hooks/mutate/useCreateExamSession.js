import { createExamSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateExamSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createExamSession(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-sessions'])
    }
  });
};

export default useCreateExamSession;
