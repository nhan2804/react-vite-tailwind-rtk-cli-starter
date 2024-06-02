import { update__name__(pascalCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdate__name__(pascalCase) = (__params__) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await update__name__(pascalCase)(__params___id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useUpdate__name__(pascalCase);
