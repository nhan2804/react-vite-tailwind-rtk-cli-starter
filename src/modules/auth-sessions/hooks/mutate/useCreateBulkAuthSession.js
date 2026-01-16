import { createBulkAuthSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateBulkAuthSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await createBulkAuthSession(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["auth-sessions"]
      });
    },
  });
};

export default useCreateBulkAuthSession;
