import { createLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await createLog(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["logs"]
      });
    },
  });
};

export default useCreateLog;
