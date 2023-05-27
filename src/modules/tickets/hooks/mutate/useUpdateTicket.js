import { updateTicket } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateTicket(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['tickets'])
    }
  });
};

export default useUpdateTicket;
