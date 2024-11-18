import { updateLog } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateLog(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['logs'])
    }
  });
};

export default useUpdateLog;
