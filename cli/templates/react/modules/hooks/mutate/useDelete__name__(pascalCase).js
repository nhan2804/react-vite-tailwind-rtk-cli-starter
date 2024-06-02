import { delete__name__(pascalCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDelete__name__(pascalCase) = (__params__) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await delete__name__(pascalCase)(__params___id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useDelete__name__(pascalCase);
