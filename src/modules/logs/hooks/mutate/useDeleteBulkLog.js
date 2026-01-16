import { deleteBulkLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBulkLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await deleteBulkLog(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["logs"]
      });
    },
  });
};

export default useDeleteBulkLog;
