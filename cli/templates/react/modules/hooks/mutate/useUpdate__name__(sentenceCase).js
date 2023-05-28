import { update__name__(sentenceCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdate__name__(sentenceCase) = (__params__) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await update__name__(sentenceCase)(__params___id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useUpdate__name__(sentenceCase);
