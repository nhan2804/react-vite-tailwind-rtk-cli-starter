import { deleteAuthSession } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteAuthSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteAuthSession(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['auth-sessions'])
    }
  });
};

export default useDeleteAuthSession;
