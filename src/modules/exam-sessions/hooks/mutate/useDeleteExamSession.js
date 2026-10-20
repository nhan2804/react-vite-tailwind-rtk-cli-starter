import { deleteExamSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteExamSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteExamSession(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['exam-sessions'])
    }
  });
};

export default useDeleteExamSession;
