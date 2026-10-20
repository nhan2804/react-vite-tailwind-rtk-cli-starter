import { updateExamRecord } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateExamRecord = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateExamRecord(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['exam-records'])
    }
  });
};

export default useUpdateExamRecord;
