import { createTicket } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createTicket(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['tickets'])
    }
  });
};

export default useCreateTicket;
