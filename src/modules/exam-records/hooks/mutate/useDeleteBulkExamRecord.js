import { deleteBulkExamRecord } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBulkExamRecord = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkExamRecord(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-records'])
    }
  });
};

export default useDeleteBulkExamRecord;
