import { createBulkTicket } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkTicket(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['tickets'])
    }
  });
};

export default useCreateBulkTicket;
