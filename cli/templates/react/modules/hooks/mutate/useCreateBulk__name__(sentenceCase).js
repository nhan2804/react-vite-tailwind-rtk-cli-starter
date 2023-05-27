import { createBulk__name__(sentenceCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulk__name__(sentenceCase) = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulk__name__(sentenceCase)(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useCreateBulk__name__(sentenceCase);
