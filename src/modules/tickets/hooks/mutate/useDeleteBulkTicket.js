import { deleteBulkTicket } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkTicket(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['tickets'])
    }
  });
};

export default useDeleteBulkTicket;
