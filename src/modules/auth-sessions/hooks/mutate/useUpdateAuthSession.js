import { updateAuthSession } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateAuthSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateAuthSession(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['auth-sessions'])
    }
  });
};

export default useUpdateAuthSession;
