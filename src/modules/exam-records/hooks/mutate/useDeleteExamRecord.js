import { deleteExamRecord } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteExamRecord = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteExamRecord(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-records'])
    }
  });
};

export default useDeleteExamRecord;
