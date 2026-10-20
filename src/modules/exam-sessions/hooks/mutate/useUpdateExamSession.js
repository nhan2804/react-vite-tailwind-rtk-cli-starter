import { updateExamSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateExamSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateExamSession(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['exam-sessions'])
    }
  });
};

export default useUpdateExamSession;
