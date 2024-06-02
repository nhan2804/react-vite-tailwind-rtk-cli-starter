import { create__name__(pascalCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreate__name__(pascalCase) = (__params__) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await create__name__(pascalCase)(__params__formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useCreate__name__(pascalCase);
