import { createBulkExamRecord } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateBulkExamRecord = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkExamRecord(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-records'])
    }
  });
};

export default useCreateBulkExamRecord;
