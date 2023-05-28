import { deleteTicket } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteTicket(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['tickets'])
    }
  });
};

export default useDeleteTicket;
