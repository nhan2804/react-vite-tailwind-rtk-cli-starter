import { deleteBulkProject } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBulkProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await deleteBulkProject(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["projects"]
      });
    },
  });
};

export default useDeleteBulkProject;
