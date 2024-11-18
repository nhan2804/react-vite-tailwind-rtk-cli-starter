import { createLog } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createLog(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['logs'])
    }
  });
};

export default useCreateLog;
