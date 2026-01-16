import { updateLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, formData }) => {
      return await updateLog(_id, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["logs"]
      });
    },
  });
};

export default useUpdateLog;
