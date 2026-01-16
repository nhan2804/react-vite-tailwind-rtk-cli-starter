import { createBulkLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateBulkLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await createBulkLog(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["logs"]
      });
    },
  });
};

export default useCreateBulkLog;
