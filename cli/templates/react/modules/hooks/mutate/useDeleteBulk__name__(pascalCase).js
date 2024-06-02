import { deleteBulk__name__(pascalCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulk__name__(pascalCase) = (__params__) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulk__name__(pascalCase)(__params__formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useDeleteBulk__name__(pascalCase);
