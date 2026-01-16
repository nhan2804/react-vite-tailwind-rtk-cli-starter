import { deleteBulkAuthSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBulkAuthSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await deleteBulkAuthSession(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["auth-sessions"]
      });
    },
  });
};

export default useDeleteBulkAuthSession;
