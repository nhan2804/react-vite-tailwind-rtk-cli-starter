import { deleteLog } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id) => {
      return await deleteLog(_id);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["logs"]
      });
    },
  });
};

export default useDeleteLog;
