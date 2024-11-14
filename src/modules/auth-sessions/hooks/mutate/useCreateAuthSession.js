import { createAuthSession } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateAuthSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createAuthSession(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['auth-sessions'])
    }
  });
};

export default useCreateAuthSession;
