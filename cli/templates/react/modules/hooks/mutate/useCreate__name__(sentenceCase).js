import { create__name__(sentenceCase) } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreate__name__(sentenceCase) = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await create__name__(sentenceCase)(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['__name__s'])
    }
  });
};

export default useCreate__name__(sentenceCase);
