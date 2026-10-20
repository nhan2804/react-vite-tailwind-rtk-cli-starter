import { createExamRecord } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateExamRecord = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createExamRecord(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-records'])
    }
  });
};

export default useCreateExamRecord;
