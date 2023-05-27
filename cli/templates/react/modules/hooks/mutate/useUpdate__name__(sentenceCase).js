import { update__name__(sentenceCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdate__name__(sentenceCase) = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await update__name__(sentenceCase)(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useUpdate__name__(sentenceCase);
